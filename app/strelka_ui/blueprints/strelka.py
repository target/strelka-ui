import datetime
import logging
import json
import os
from collections import defaultdict

from typing import Dict, Tuple, Union

from flask import Blueprint, jsonify, request, session, Response
from sqlalchemy import or_, desc, asc, func, case, cast, String
from sqlalchemy.orm import joinedload, defer

from strelka_ui.database import db
from strelka_ui.models import FileSubmission, User, get_request_id
from strelka_ui.services.auth import auth_required
from strelka_ui.services.files import (
    decrypt_file,
    check_file_size,
    convert_bytesio_to_filestorage,
)
from strelka_ui.services.strelka import get_db_status, get_frontend_status, submit_data
from strelka_ui.services.s3 import upload_file, calculate_expires_at, is_s3_enabled, download_file, is_file_expired
from strelka_ui.services.virustotal import (
    get_virustotal_positives,
    create_vt_zip_and_download,
    get_virustotal_widget_url,
)
from strelka_ui.services.insights import get_insights

# pylint: disable=no-member

strelka = Blueprint("strelka", __name__, url_prefix="/strelka")

# Define the priority of each mimetype (For VirusTotal Scanning Priorization)
MIMETYPE_PRIORITY = {
    "application/x-dosexec": 1,  # Executables
    "application/x-executable": 1,
    "application/vnd.microsoft.portable-executable": 1,
    "application/x-elf": 1,
    "application/zip": 2,  # Archives
    "application/x-rar-compressed": 2,
    "application/x-msi": 2,
    "application/x-7z-compressed": 2,
    "application/vnd.ms-cab-compressed": 2,
    "application/x-tar": 2,
    "application/gzip": 2,
    "application/octet-stream": 2,  # Unknown streams
    "text/plain": 3,  # Scripts and source code
    "text/x-script": 3,
    "text/javascript": 3,
    "application/x-bat": 3,
    "application/x-sh": 3,
    "application/x-python": 3,
    "text/x-python": 3,
    "text/html": 4,  # Web files
    "application/xhtml+xml": 4,
    "text/xml": 4,
    "text/css": 4,
    "application/pdf": 5,  # Documents
    "application/msword": 5,
    "application/vnd.ms-excel": 5,
    "application/vnd.ms-powerpoint": 5,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 5,
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": 5,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": 5,
    # Images
    "image/jpeg": 10,
    "image/png": 10,
    "image/gif": 10,
    "image/webp": 10,
    "image/tiff": 10,
    "image/bmp": 10,
    "image/svg+xml": 10,
    # Other file types
    "application/json": 20,  # Data formats
    "application/xml": 20,
}


@strelka.route("/status/strelka", methods=["GET"])
def get_server_status() -> Tuple[Response, int]:
    """
    Returns the status of the Strelka service.

    Returns:
        A Flask response object with a JSON-encoded message indicating whether
        Strelka is reachable (200) or not (500).
    """
    try:
        if get_frontend_status():
            return jsonify({"message": "Strelka is reachable"}), 200
        else:
            return jsonify({"message": "Strelka is not reachable"}), 500
    except Exception:
        return jsonify({"message": "Strelka is not reachable"}), 500


@strelka.route("/status/database", methods=["GET"])
def get_database_status() -> Tuple[Response, int]:
    """
    Returns the status of the database.

    Returns:
        A Flask response object with a JSON-encoded message indicating whether
        the database is reachable (200) or not (500).
    """
    try:
        if get_db_status():
            return jsonify({"message": "Database is reachable"}), 200
        else:
            return jsonify({"message": "Database is not reachable"}), 500
    except Exception:
        return jsonify({"message": "Database is not reachable"}), 500


@strelka.route("/upload", methods=["POST"])
@auth_required
def submit_file(
    user: User,
) -> Union[tuple[Response, int], tuple[dict[str, Union[Response, str]], int]]:
    """
    Submit a file (or hash) to the Strelka file analysis engine and save the analysis results to the database.

    Args:
        user: User object representing the authenticated user submitting the file.

    Returns:
        If successful, returns the Strelka analysis results and a 200 status code.
        If unsuccessful, returns an error message and a 500 status code.

    Raises:
        None.
    """
    submitted_hash = ""

    if "file" not in request.files and b"hash" not in request.data:
        return (
            jsonify(
                {
                    "error": "Strelka submission was not successful.",
                    "details": "No file in request.",
                }
            ),
            400,
        )

    # File Upload Function
    # Get the submitted file.
    if "file" in request.files:
        file = request.files["file"]
        submitted_description = request.form["description"]
        submitted_password = request.form.get("password", "")
        submitted_type = "api"

        # Check if the submitted filename is empty.
        if file.filename == "":
            return (
                jsonify(
                    {
                        "error": "Strelka submission was not successful.",
                        "details": "Submitted filename is empty.",
                    }
                ),
                400,
            )

        # Check to see if size of file is greater than 150MB
        is_valid_size, file_size = check_file_size(file.stream)
        if not is_valid_size:
            return (
                jsonify(
                    {
                        "error": "Strelka submission was not successful.",
                        "details": f"File submitted cannot be larger than 150MB. Actual size: {file_size} bytes.",
                    }
                ),
                400,
            )

        # If a password was provided, we must attempt to unpack it.
        if submitted_password:
            try:
                # Assume all uploads should be attempted to be unpacked
                file, message = decrypt_file(file, submitted_password)
                if not file:
                    return (
                        jsonify({"error": "Failed to unpack file", "details": message}),
                        400,
                    )
                else:
                    file = message
            except Exception as e:
                return (
                    jsonify({"error": "Failed to unpack file", "details": str(e)}),
                    400,
                )

    # VirusTotal Upload Function
    else:
        submission = json.loads(request.data)
        submitted_description = submission["description"]
        submitted_hash = submission["hash"]
        submitted_type = "virustotal"

        if os.environ.get("VIRUSTOTAL_API_KEY"):
            try:
                file = create_vt_zip_and_download(
                    api_key=os.environ.get("VIRUSTOTAL_API_KEY"),
                    file_hash=[submitted_hash],
                    password="infected",
                )

                # Check if response is successful
                file = convert_bytesio_to_filestorage(file, submission["hash"])

                # Decrypt to file prior to submission to Strelka
                file, message = decrypt_file(file, "infected")

                if file:
                    file = message

            except Exception:
                return (
                    jsonify(
                        {
                            "error": "VirusTotal request was not successful.",
                            "details": "Hash not found on VirusTotal.",
                        }
                    ),
                    400,
                )
        else:
            return (
                jsonify(
                    {
                        "error": "VirusTotal request was not successful.",
                        "details": "No VirusTotal API key has been loaded. Check the README for details.",
                    }
                ),
                400,
            )
    if file:
        response = ""
        if isinstance(file, list):
            for f in file:
                r = submit_to_strelka(
                    f, user, submitted_hash, submitted_description, submitted_type
                )
                if not response:
                    response = r
        else:
            response = submit_to_strelka(
                file, user, submitted_hash, submitted_description, submitted_type
            )
        return response


def submit_to_strelka(
    file, user, submitted_hash, submitted_description, submitted_type, bypass_gatekeeper=False
):
    """
    Submit file to Strelka for analysis and save results to the database.

    Args:
        file: File object to be submitted.
        user: User object representing the authenticated user.
        submitted_hash: Hash of the submitted file.
        submitted_description: Description of the submitted file.
        submitted_type: Type of submission (e.g., 'api', 'virustotal', 'resubmission').
        bypass_gatekeeper: If True, bypasses gatekeeper caching for this request.

    Returns:
        Analysis results and a 200 status code if successful.
        Error message and a 415 status code if unsuccessful.
    """
    total_scanned_with_hits = []
    # Submit the file to the Strelka analysis engine.
    try:
        # Get the current timestamp and the file description from the request.
        submitted_at = str(datetime.datetime.utcnow())

        # Submit the file to Strelka and get the analysis results.
        succeeded, response, file_size = submit_data(
            file,
            {
                "user_name": user.user_cn,
                "client_user_name": user.user_cn,
            },
            submitted_hash,
            bypass_gatekeeper=bypass_gatekeeper,
        )

        # If the Strelka submission was not successful, return an error message.
        if not succeeded:
            return (
                jsonify({"error": "Failed to submit file", "details": str(response)}),
                415,
            )

        def get_mimetype_priority(mime_list):
            # Return the highest priority of the mimetypes in the list
            return min(MIMETYPE_PRIORITY.get(mime, 9999) for mime in mime_list)

        # If VirusTotal API key provided, get positives (VIRUSTOTAL_API_LIMIT determined Max Scans per Request)
        # -1    = VirusTotal Lookup Error
        # -2    = VirusTotal API Key Not Provided
        # >= 0  = Response Positives from VirusTotal
        if os.environ.get("VIRUSTOTAL_API_KEY"):
            total_scanned = 0
            try:
                # Sort files by the priority of their mimetypes
                sorted_files = sorted(
                    response,
                    key=lambda x: get_mimetype_priority(x["file"]["flavors"]["mime"]),
                )
                for scanned_file in sorted_files:
                    if total_scanned <= int(os.environ.get("VIRUSTOTAL_API_LIMIT")):
                        scanned_file["enrichment"] = {"virustotal": -2}
                        scanned_file["enrichment"]["virustotal"] = (
                            get_virustotal_positives(
                                api_key=os.environ.get("VIRUSTOTAL_API_KEY"),
                                file_hash=scanned_file["scan"]["hash"]["sha256"],
                            )
                        )
                        total_scanned += 1.0
                        if scanned_file["enrichment"]["virustotal"] > 0:
                            total_scanned_with_hits.append(
                                {
                                    "file_sha256": scanned_file["scan"]["hash"][
                                        "sha256"
                                    ],
                                    "positives": scanned_file["enrichment"][
                                        "virustotal"
                                    ],
                                }
                            )
                    else:
                        scanned_file["enrichment"] = {"virustotal": -3}
            except Exception as e:
                logging.warning(f"Could not process VirusTotal search with error: {e} ")

        # Get Strelka Submission IoCs
        # Store a set of IoCs in IoCs field

        # Handle S3 upload if enabled
        s3_key = None
        s3_expires_at = None
        if is_s3_enabled():
            try:
                # Create temporary submission ID for S3 key generation
                temp_submission_id = get_request_id(response[0])
                success, s3_key, error_msg = upload_file(file, temp_submission_id)
                if success:
                    s3_expires_at = calculate_expires_at()
                    logging.info(f"Successfully uploaded file to S3: {s3_key}")
                else:
                    logging.warning(f"Failed to upload file to S3: {error_msg}")
            except Exception as e:
                logging.error(f"Unexpected error during S3 upload: {e}")

        # Create a new submission object and add it to the database.
        new_submission = FileSubmission(
            file.filename,
            file_size,
            response,
            submitted_type,
            request.remote_addr,
            request.headers.get("User-Agent"),
            user.id,
            submitted_description,
            submitted_at,
            s3_key,
            s3_expires_at
        )

        db.session.add(new_submission)

        # Increase the user's submission count.
        user.files_submitted += 1

        db.session.flush()
        db.session.commit()

        # Return the analysis results and a 200 status code.
        return (
            jsonify(
                {
                    "file_id": str(new_submission.file_id),
                    "response": response,
                    "meta": {
                        "file_size": new_submission.file_size,
                        "iocs": new_submission.iocs,
                        "vt_positives": list(total_scanned_with_hits),
                    },
                }
            ),
            200,
        )
    # If an exception occurs, log the error and return an error message.
    except Exception as e:
        return (
            jsonify(
                {
                    "error": "Strelka submission was not successful.",
                    "details": str(e),
                }
            ),
            500,
        )


def get_request_time(response: dict) -> str:
    """
    Get the time of the request from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        str: The time of the request if it exists, otherwise an empty string.
    """
    return (
        str(datetime.datetime.fromtimestamp(response["request"]["time"]))
        if "request" in response and "time" in response["request"]
        else ""
    )

@strelka.route("/scans/stats")
@auth_required
def get_scan_stats(user: User) -> Tuple[jsonify, int]:
    """Return scan statistics for the user.

    Args:
        user: A User object representing the authenticated user.

    Returns:
        A tuple containing the scan statistics in JSON format and an HTTP status code.

    """

    # Get total number of submissions
    all_time = db.session.query(FileSubmission).count()

    # Get number of submissions in the past 30 days
    thirty_days = (
        db.session.query(FileSubmission)
        .filter(
            FileSubmission.submitted_at
            >= datetime.datetime.utcnow() - datetime.timedelta(30)
        )
        .count()
    )

    # Get number of submissions in the past 7 days
    seven_days = (
        db.session.query(FileSubmission)
        .filter(
            FileSubmission.submitted_at
            >= datetime.datetime.utcnow() - datetime.timedelta(7)
        )
        .count()
    )

    # Get number of submissions in the past 24 hours
    twentyfour_hours = (
        db.session.query(FileSubmission)
        .filter(
            FileSubmission.submitted_at
            >= datetime.datetime.utcnow() - datetime.timedelta(1)
        )
        .count()
    )

    # Return scan statistics in JSON format and HTTP status code 200
    return (
        jsonify(
            {
                "all_time": all_time,
                "thirty_days": thirty_days,
                "seven_days": seven_days,
                "twentyfour_hours": twentyfour_hours,
            }
        ),
        200,
    )


@strelka.route("/scans/<id>")
@auth_required
def get_scan(user: User, id: str) -> Tuple[Response, int]:
    """
    Retrieves the scan results for the given submission ID.

    Args:
        user: The authenticated user.
        id: The ID of the submission to retrieve.

    Returns:
        A JSON representation of the scan results if the submission is found,
        otherwise a "not found" string and a 404 status code.
    """
    submission = (
        db.session.query(FileSubmission)
        .options(joinedload(FileSubmission.user))
        .filter_by(file_id=id)
        .first()
    )

    if submission:
        return jsonify(submissions_to_json(submission)), 200
    else:
        return (
            jsonify(
                {
                    "error": "Strelka scan unable to be retrieved.",
                    "details": f"Scan {id} not found.",
                }
            ),
            404,
        )


@strelka.route("/scans", methods=["GET"])
@auth_required
def view(user: User) -> Tuple[Dict[str, any], int]:
    """
    Returns a paginated list of submissions, optionally filtered to only show
    the current user's submissions, with the ability to search and sort.

    Args:
        user: The authenticated user.

    Returns:
        A JSON representation of the paginated list of submissions, including
        pagination information and a list of submissions.
    """
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=10, type=int)
    just_mine = request.args.get("just_mine", default=False, type=bool)
    search_query = request.args.get("search", default="", type=str)
    sort_field = request.args.get("sortField", default="submitted_at", type=str)
    sort_order = request.args.get("sortOrder", default="descend", type=str)
    excluded_submitters = request.args.get("exclude_submitters", "")
    excluded_submitters_list = (
        excluded_submitters.split(",") if excluded_submitters else []
    )

    # Build the base query with a join to the User table
    base_query = FileSubmission.query.options(defer("strelka_response")).join(User).options(
        joinedload(FileSubmission.user)
    )

    # Exclude submissions from specific submitters
    if excluded_submitters_list:
        base_query = base_query.filter(~User.user_cn.in_(excluded_submitters_list))

    # Apply the search filter if there is a search query
    if search_query:
        search_filter = or_(
            FileSubmission.file_name.ilike(f"%{search_query}%"),
            FileSubmission.submitted_description.ilike(f"%{search_query}%"),
            cast(FileSubmission.yara_hits, String).ilike(f"%{search_query}%"),
            User.user_cn.ilike(f"%{search_query}%"),
        )
        base_query = base_query.filter(search_filter)

    # Apply the "just mine" filter if requested
    if just_mine:
        user_id = session["user_id"]
        base_query = base_query.filter(FileSubmission.submitted_by_user_id == user_id)

    # Apply sorting
    # Conditional case statements for sorting
    sort_cases = {
        "file_count": case(
            [
                (
                    FileSubmission.files_seen != None,
                    FileSubmission.files_seen,
                )
            ],
            else_=0,
        ),
        "size": case(
            [(FileSubmission.file_size != None, FileSubmission.file_size)], else_=0
        ),
        "iocs": case(
            [
                (
                    FileSubmission.iocs != None,
                    func.cardinality(FileSubmission.iocs),
                )
            ],
            else_=0,
        ),
        "insights": case(
            [
                (
                    FileSubmission.insights != None,
                    func.cardinality(FileSubmission.insights),
                )
            ],
            else_=0,
        ),
        "yara_hits": case(
            [
                (
                    FileSubmission.yara_hits != None,
                    func.cardinality(FileSubmission.yara_hits),
                )
            ],
            else_=0,
        ),
        "scanners_run": case(
            [
                (
                    FileSubmission.scanners_run != None,
                    func.cardinality(FileSubmission.scanners_run),
                )
            ],
            else_=0,
        ),
    }

    # Apply sorting
    if sort_field in sort_cases:
        sort_expression = sort_cases[sort_field]
        if sort_order == "ascend":
            base_query = base_query.order_by(sort_expression.asc())
        elif sort_order == "descend":
            base_query = base_query.order_by(sort_expression.desc())
    else:
        # Default sorting for other fields
        sort_expression = (
            desc(sort_field) if sort_order == "descend" else asc(sort_field)
        )
        base_query = base_query.order_by(sort_expression)

    # Execute the paginated query
    submissions = base_query.paginate(page=page, per_page=per_page)

    # Convert submission objects to JSON
    paginated_ui = {
        "page": submissions.page,
        "pages": submissions.pages,
        "total": submissions.total,
        "per_page": submissions.per_page,
        "has_next": submissions.has_next,
        "has_prev": submissions.has_prev,
        "items": list(map(lambda x: submissions_to_json(x), submissions.items)),
    }

    return paginated_ui, 200


@strelka.route("/scans/mime-type-stats", methods=["GET"])
@auth_required
def get_mime_type_stats(user: User) -> Tuple[Response, int]:
    """
    Get the count of file submissions for the last 6 months, categorized by MIME types.

    Returns:
        JSON response with counts of submissions by MIME type per month.
    """

    six_months_ago = datetime.datetime.utcnow() - datetime.timedelta(days=180)
    results = (
        db.session.query(
            func.date_trunc("month", FileSubmission.submitted_at).label("month"),
            FileSubmission.mime_types,
            func.count(FileSubmission.id),
        )
        .filter(FileSubmission.submitted_at >= six_months_ago)
        .group_by("month", FileSubmission.mime_types)
        .all()
    )

    stats = defaultdict(lambda: defaultdict(int))
    for month, mime_types, count in results:
        for mime_type in mime_types:
            stats[month.strftime("%Y-%m")][mime_type] += count

    return jsonify(stats), 200


@strelka.route("/virustotal/widget-url", methods=["POST"])
@auth_required
def get_vt_widget_url(resource: str) -> Tuple[Response, int]:
    """
    Route to get a VirusTotal widget url with customized theme colors.

    Returns:
        A JSON response containing the VirusTotal widget url or an error message.
    """
    data = request.get_json()
    if not data or "resource" not in data:
        return jsonify({"error": "Resource identifier is required"}), 400

    # Strelka UI Defaults
    fg1 = data.get("fg1", "333333")  # Dark text color
    bg1 = data.get("bg1", "FFFFFF")  # Light background color
    bg2 = data.get("bg2", "F5F5F5")  # Slightly grey background for differentiation
    bd1 = data.get("bd1", "E8E8E8")  # Light grey border color

    api_key = os.getenv("VIRUSTOTAL_API_KEY")
    if not api_key:
        return jsonify({"error": "VirusTotal API key is not available."}), 500

    try:
        # Pass the theme colors to the function
        widget_url = get_virustotal_widget_url(
            api_key, data["resource"], fg1, bg1, bg2, bd1
        )
        return jsonify({"widget_url": widget_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@strelka.route("/check_vt_api_key", methods=["GET"])
def check_vt_api_key():
    """
    Endpoint to check if the VirusTotal API key is available.

    Returns:
        A boolean response containing the VirusTotal widget url or an error message.
    """
    api_key_exists = bool(os.environ.get("VIRUSTOTAL_API_KEY"))
    return jsonify({"apiKeyAvailable": api_key_exists}), 200


@strelka.route("/resubmit/<submission_id>", methods=["POST"])
@auth_required
def resubmit_file(user: User, submission_id: str) -> Tuple[Response, int]:
    """
    Resubmit a file from S3 storage for analysis.
    
    Args:
        user: User object representing the authenticated user.
        submission_id: ID of the original submission to resubmit.
        
    Returns:
        If successful, returns the new submission details and a 200 status code.
        If unsuccessful, returns an error message and appropriate status code.
    """
    if not is_s3_enabled():
        return jsonify({
            "error": "File resubmission is not enabled",
            "details": "S3 storage is not configured or feature is disabled"
        }), 400
    
    try:
        # Find the original submission
        original_submission = db.session.query(FileSubmission).filter_by(
            file_id=submission_id
        ).first()
        
        if not original_submission:
            return jsonify({
                "error": "Original submission not found",
                "details": f"Submission {submission_id} does not exist"
            }), 404
        
        # Check if file has S3 key
        if not original_submission.s3_key:
            return jsonify({
                "error": "File not available for resubmission",
                "details": "Original file was not stored in S3"
            }), 400
        
        # Check if file has expired
        if original_submission.s3_expires_at and is_file_expired(original_submission.s3_expires_at):
            return jsonify({
                "error": "File has expired",
                "details": "The original file has been automatically deleted due to retention policy"
            }), 410
        
        # Download file from S3
        success, file_storage, error_msg = download_file(original_submission.s3_key)
        if not success:
            return jsonify({
                "error": "Failed to retrieve file from storage",
                "details": error_msg
            }), 500

        new_description = f"Resubmission of /submissions/{original_submission.file_id}"
        
        # Use the existing submit_to_strelka function with resubmission type
        # We need to temporarily modify the file object to include the new description
        class ResubmissionFile:
            def __init__(self, file_storage, description):
                self.filename = file_storage.filename
                self.stream = file_storage.stream
                self.content_type = file_storage.content_type
                self.description = description
                
            def seek(self, *args, **kwargs):
                return self.stream.seek(*args, **kwargs)
                
            def read(self, *args, **kwargs):
                return self.stream.read(*args, **kwargs)
        
        resubmission_file = ResubmissionFile(file_storage, new_description)
        
        # Call the existing submit_to_strelka function
        response = submit_to_strelka(
            resubmission_file,
            user,
            "",  # No submitted_hash for resubmission
            new_description,
            "resubmission",  # Mark as resubmission type
            bypass_gatekeeper=True  # Bypass gatekeeper for resubmissions
        )
        
        # Add original submission ID to the response
        if isinstance(response, tuple) and len(response) == 2:
            response_data, status_code = response
            if status_code == 200 and hasattr(response_data, 'get_json'):
                json_data = response_data.get_json()
                json_data["original_submission_id"] = submission_id
                return jsonify(json_data), status_code
        
        return response
        
    except Exception as e:
        logging.error("Error during file resubmission: %s", e)
        return jsonify({
            "error": "File resubmission failed",
            "details": str(e)
        }), 500

def submissions_to_json(submission: FileSubmission) -> Dict[str, any]:
    """
    Converts the given submission to a dictionary representation that can be
    returned as JSON.

    Args:
        submission: The submission to convert.

    Returns:
        A dictionary representation of the submission, including its metadata
        and the metadata of the user who submitted it.
    """
    val = submission.as_dict()
    val["user"] = submission.user.as_dict()
    return val
