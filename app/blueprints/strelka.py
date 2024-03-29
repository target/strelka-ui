import datetime
import logging
import json
import os
from collections import defaultdict

from typing import Dict, Tuple, Union

from flask import Blueprint, current_app, jsonify, request, session, Response
from sqlalchemy import or_, desc, asc, func, case, cast, String
from sqlalchemy.orm import joinedload

from database import db
from models import FileSubmission, User
from services.auth import auth_required
from services.strelka import get_db_status, get_frontend_status, submit_data
from services.virustotal import (
    get_virustotal_positives,
    create_vt_zip_and_download,
    download_vt_bytes,
)
from services.insights import get_insights

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
    "application/xml": 4,
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
    total_scanned_with_hits = []

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

    # VirusTotal Upload Function
    else:
        submission = json.loads(request.data)
        submitted_description = submission["description"]
        submitted_hash = submission["hash"]
        submitted_encrypted = submission.get("encrypted", True)
        submitted_type = "virustotal"

        if os.environ.get("VIRUSTOTAL_API_KEY"):
            try:
                if submitted_encrypted:
                    file = create_vt_zip_and_download(
                        api_key=os.environ.get("VIRUSTOTAL_API_KEY"),
                        file_hash=[submitted_hash],
                        password="infected",
                    )
                else:
                    file = download_vt_bytes(
                        api_key=os.environ.get("VIRUSTOTAL_API_KEY"),
                        file_hash=submitted_hash,
                    )

            except Exception as e:
                return (
                    jsonify(
                        {
                            "error": "VirusTotal request was not successful.",
                            "details": str(e),
                        }
                    ),
                    400,
                )

            # Assume file is a BytesIO object and set a filename attribute
            file.filename = submitted_hash

    # Submit the file to the Strelka analysis engine.
    if file:
        try:
            # Get the current timestamp and the file description from the request.
            submitted_at = str(datetime.datetime.utcnow())

            # Submit the file to Strelka and get the analysis results.
            succeeded, response, file_size = submit_data(
                file,
                {"source": "fileshot-webui", "user_name": user.user_cn},
                submitted_hash,
            )

            # If the Strelka submission was not successful, return an error message.
            if not succeeded:
                return (
                    jsonify(
                        {"error": "Failed to submit file", "details": str(response)}
                    ),
                    415,
                )

            # If the Strelka submission was successful, save the analysis results to the database.
            # Get the submitted file object from the analysis results.
            submitted_file = response[0]

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
                        key=lambda x: get_mimetype_priority(
                            x["file"]["flavors"]["mime"]
                        ),
                    )
                    for scanned_file in sorted_files:
                        if total_scanned <= int(os.environ.get("VIRUSTOTAL_API_LIMIT")):
                            scanned_file["enrichment"] = {"virustotal": -2}
                            scanned_file["enrichment"][
                                "virustotal"
                            ] = get_virustotal_positives(
                                api_key=os.environ.get("VIRUSTOTAL_API_KEY"),
                                file_hash=scanned_file["scan"]["hash"]["sha256"],
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
                    logging.warning(
                        f"Could not process VirusTotal search with error: {e} "
                    )

            # Get Strelka Submission IoCs
            # Store a set of IoCs in IoCs field
            try:
                iocs = set()
                for scanned_file in response:
                    if "iocs" in scanned_file:
                        for ioc in scanned_file["iocs"]:
                            iocs.add(ioc["ioc"])
                    else:
                        pass
            except Exception as e:
                logging.warning(f"Could not process Insights search with error: {e} ")

            # Get Strelka Submission Insights
            # Store a set of insights in Insights field
            # Store a set of insights at the file level
            try:
                insights = set()
                for index, scanned_file in enumerate(response):
                    file_insights = get_insights(scanned_file)
                    if file_insights:
                        response[index]["insights"] = list(file_insights)
                        insights.update(file_insights)
                    else:
                        pass
            except Exception as e:
                logging.warning(f"Could not process Insights search with error: {e} ")

            # Create a new submission object and add it to the database.
            new_submission = FileSubmission(
                get_request_id(submitted_file),
                file.filename,
                file_size,
                response,
                get_mimetypes(response),
                get_yara_hits(response),
                len(response),
                get_scanners_run(response),
                get_hashes(submitted_file),
                list(insights),
                list(iocs),
                submitted_type,
                request.remote_addr,
                request.headers.get("User-Agent"),
                user.id,
                submitted_description,
                submitted_at,
                get_request_time(submitted_file),
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
                            "file_size": int(file_size),
                            "iocs": list(iocs),
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


def get_request_id(response: dict) -> str:
    """
    Get the ID of the request from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        str: The ID of the request if it exists, otherwise an empty string.
    """
    return (
        response["request"]["id"]
        if "request" in response and "id" in response["request"]
        else ""
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


def get_mimetypes(response: list) -> list:
    """
    Get a list of unique MIME types found in the Strelka response.

    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of unique MIME types.
    """
    mimetypes = set()

    for r in response:
        for mimetype in r["file"]["flavors"]["mime"]:
            mimetypes.add(mimetype)
    return list(mimetypes)


def get_scanners_run(response: list) -> list:
    """
    Get a list of scanners that were run on the file in the Strelka response.

    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of scanner names.
    """
    scanners = set()

    for r in response:
        scanners.update(r["file"]["scanners"])
    return list(scanners)


def get_yara_hits(response: list) -> list:
    """
    Get a list of unique YARA rules that matched the file in the Strelka response.

    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of YARA rule names.
    """
    yarahits = set()

    for r in response:
        matches = r.get("scan", {}).get("yara", {}).get("matches")

        if not isinstance(matches, list):
            continue

        for yarahit in matches:
            yarahits.add(yarahit)
    return list(yarahits)


def get_hashes(response: dict) -> list:
    """
    Get a dictionary of hashes and their values from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        list: A list of (hash_type, hash_value) tuples.
    """
    hashes = (
        response["scan"]["hash"].copy()
        if "scan" in response and "hash" in response["scan"]
        else {}
    )
    del hashes["elapsed"]
    return hashes.items()


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
    base_query = FileSubmission.query.join(User).options(
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
    submissions = base_query.paginate(page, per_page)

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
