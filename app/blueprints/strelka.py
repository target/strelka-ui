import datetime
import json

from flask import Blueprint, current_app, request, session, jsonify
from sqlalchemy.orm import joinedload

from database import db
from services.strelka import submit_file
from models import User, FileSubmission

strelka = Blueprint("strelka", __name__, url_prefix="/strelka")


@strelka.route("/upload", methods=["POST"])
def submitFile():
    if not session.get("logged_in"):
        return "unauthenticated", 401

    if "file" not in request.files:
        return "no file in request", 400

    file = request.files["file"]
    if file.filename == "":
        return "submitted filename is empty", 400

    if file:
        try:
            submitted_at = str(datetime.datetime.utcnow())
            submitted_description = request.form['description']

            succeeded, response, file_size = submit_file(
                file, {"source": "fileshot-webui", "user_name": session.get("user_cn")}
            )

            if not succeeded:
                return "strelka submission was not successful", 500
            else:
                user_id = session.get("user_id")
                current_app.logger.info("saving new submission for user %s", user_id)

                # Save Submission to Submission Table
                newSubmission = FileSubmission(
                    getRequestID(response),
                    file.filename,
                    file_size,
                    response,
                    getMimeTypes(response),
                    getYaraHits(response),
                    getScannersRun(response),
                    getHashes(response),
                    request.remote_addr,
                    request.headers.get("User-Agent"),
                    user_id,
                    submitted_description,
                    submitted_at,
                    getRequestTime(response),
                )

                db.session.add(newSubmission)

                # Increase Submission Stat for User
                # Upsert the user record with an additional submission counter
                user_name = session.get("user_cn")
                dbUser = db.session.query(User).filter_by(user_cn=user_name).first()
                dbUser.files_submitted += 1

                db.session.flush()
                db.session.commit()

                return response, 200

        except Exception as e:
            current_app.logger.info("failed to submit %s to strelka: %s", file.filename, e)
            return "strelka submission was not successful", 500


def getRequestID(response):
    return (
        response["request"]["id"]
        if "request" in response
        and "id" in response["request"]
        else ""
    )


def getRequestTime(response):
    return (
        str(datetime.datetime.fromtimestamp(response["request"]["time"]))
        if "request" in response
        and "time" in response["request"]
        else ""
    )


def getMimeTypes(response):
    return (
        response["file"]["flavors"]["mime"]
        if "file" in response
        and "flavors" in response["file"]
        and "mime" in response["file"]["flavors"]
        else []
    )


def getScannersRun(response):
    return (
        response["file"]["scanners"]
        if "file" in response
        and "scanners" in response["file"]
        else []
    )


def getYaraHits(response):
    return (
        response["scan"]["yara"]["matches"]
        if "scan" in response
        and "yara" in response["scan"]
        and "matches" in response["scan"]["yara"]
        else []
    )


def getHashes(response):
    hashes = response["scan"]["hash"].copy() \
             if "scan" in response \
             and "hash" in response["scan"] \
             else {}
    del hashes["elapsed"]
    return hashes.items()


@strelka.route("/scans/stats")
def getScanStats():
    if not session.get('logged_in'):
        return "unauthenticated", 401

    all_time = db.session.query(FileSubmission).count()
    thirty_days = (
        db.session.query(FileSubmission)
        .filter(FileSubmission.submitted_at >= getTimeDelta(30))
        .count()
    )
    seven_days = (
        db.session.query(FileSubmission)
        .filter(FileSubmission.submitted_at >= getTimeDelta(7))
        .count()
    )
    twentyfour_hours = (
        db.session.query(FileSubmission)
        .filter(FileSubmission.submitted_at >= getTimeDelta(1))
        .count()
    )

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


def getTimeDelta(days):
    return datetime.datetime.utcnow() - datetime.timedelta(days)

@strelka.route("/scans/<id>")
def getScan(id):
    if not session.get("logged_in"):
        return "unauthenticated", 401

    submission = db.session.query(FileSubmission).options(joinedload(FileSubmission.user)).filter_by(file_id=id).first()

    if submission is not None:
        return submissionsToJson(submission), 200
    else:
        return "not found", 404


@strelka.route("/scans", methods=["GET"])
def view():
    if not session.get("logged_in"):
        return "unauthenticated", 401

    page = request.args.get("page", default=1, type=int)
    per_page = request.args.get("per_page", default=1, type=int)
    just_mine = request.args.get("just_mine", default=False, type=bool)

    if (just_mine):
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
        "items": list(map(lambda x: submissionsToJson(x), submissions.items)),
    }

    return paginated_ui, 200

def submissionsToJson(submission):
    val = submission.as_dict()
    val["user"] = submission.user.as_dict()
    return val
