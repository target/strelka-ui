import datetime
import logging
import os
from typing import Any, Dict, Tuple

from flask import Blueprint, current_app, jsonify, request, session, Response
from sqlalchemy.orm import joinedload

from database import db
from models import FileSubmission, User
from services.auth import auth_required
from services.strelka import get_db_status, get_frontend_status, submit_data
from services.virustotal import get_virustotal_positives

strelka = Blueprint("strelka", __name__, url_prefix="/strelka")


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
def submit_file(user: User) -> Tuple[Response, int]:
    """
    Submit a file to the Strelka file analysis engine and save the analysis results to the database.

    Args:
        user: User object representing the authenticated user submitting the file.

    Returns:
        If successful, returns the Strelka analysis results and a 200 status code.
        If unsuccessful, returns an error message and a 500 status code.

    Raises:
        None.
    """

    # Check if a file was included in the request.
    if "file" not in request.files:
        return (
            jsonify(
                {
                    "error": "Strelka submission was not successful.",
                    "details": "No file in request.",
                }
            ),
            400,
        )

    # Get the submitted file.
    file = request.files["file"]

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

    # Submit the file to the Strelka analysis engine.
    if file:
        try:
            # Get the current timestamp and the file description from the request.
            submitted_at = str(datetime.datetime.utcnow())
            submitted_description = request.form["description"]

            # Submit the file to Strelka and get the analysis results.
            succeeded, response, file_size = submit_data(
                file, {"source": "fileshot-webui", "user_name": user.user_cn}
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

            # If VirusTotal API key provided, get positives (VIRUSTOTAL_API_LIMIT determined Max Scans per Request)
            # -1    = VirusTotal Lookup Error
            # -2    = VirusTotal API Key Not Provided
            # >= 0  = Response Positives from VirusTotal
            if os.environ.get("VIRUSTOTAL_API_KEY"):
                total_scanned = 0
                try:
                    for scanned_file in response:
                        if total_scanned <= int(os.environ.get("VIRUSTOTAL_API_LIMIT")):
                            scanned_file["enrichment"] = {"virustotal": -2}
                            scanned_file["enrichment"][
                                "virustotal"
                            ] = get_virustotal_positives(
                                api_key=os.environ.get("VIRUSTOTAL_API_KEY"),
                                file_hash=scanned_file["scan"]["hash"]["md5"],
                            )
                            total_scanned += 1
                        else:
                            pass
                except Exception as e:
                    logging.warning(
                        f"Could not process VirusTotal search with error: {e} "
                    )

            # Create a new submission object and add it to the database.
            new_submission = FileSubmission(
                get_request_id(submitted_file),
                file.filename,
                file_size,
                response,
                get_mimetypes(response),
                get_yara_hits(response),
                get_scanners_run(response),
                get_hashes(submitted_file),
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
            return jsonify(response), 200

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
    the current user's submissions.

    Args:
        user: The authenticated user.

    Returns:
        A JSON representation of the paginated list of submissions, including
        pagination information and a list of submissions.
    """
    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=1, type=int)
    just_mine = request.args.get("just_mine", default=False, type=bool)

    if just_mine:
        user_id = session["user_id"]
        submissions = (
            FileSubmission.query.options(joinedload(FileSubmission.user))
            .filter(FileSubmission.submitted_by_user_id == user_id)
            .order_by(FileSubmission.submitted_at.desc())
            .paginate(page, per_page, error_out=False)
        )
    else:
        submissions = (
            FileSubmission.query.options(joinedload(FileSubmission.user))
            .order_by(FileSubmission.submitted_at.desc())
            .paginate(page, per_page, error_out=False)
        )

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
