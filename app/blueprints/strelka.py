import datetime

from flask import Blueprint, current_app, request, session, jsonify
from sqlalchemy.orm import joinedload

from database import db
from services.strelka import submit_file, get_frontend_status
from services.auth import auth_required
from models import User, FileSubmission

strelka = Blueprint("strelka", __name__, url_prefix="/strelka")


@strelka.route("/status", methods=["GET"])
def getServerStatus():
    try:
        if get_frontend_status():
            return jsonify({"message": "Server is reachable"}, 200)
        else:
            return jsonify({"message": "Server is not reachable"}, 500)
    except Exception as e:
        return "strelka submission was not successful", 500


@strelka.route("/upload", methods=["POST"])
@auth_required
def submitFile():
    if not session.get("logged_in"):
        return jsonify({"message": "unauthenticated"}, 401)

    if "file" not in request.files:
        return jsonify({"message": "no file in request"}, 400)

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"message": "submitted filename is empty"}, 400)

    if file:
        try:
            submitted_at = str(datetime.datetime.utcnow())
            submitted_description = request.form["description"]

            succeeded, response, file_size = submit_file(
                file, {"source": "fileshot-webui", "user_name": session.get("user_cn")}
            )

            if not succeeded:
                return jsonify(
                    {"message": "strelka submission was not successful"}, 500
                )
            else:
                user_id = session.get("user_id")
                current_app.logger.info("saving new submission for user %s", user_id)

                # Submitted File (For Top Level Metadata Parsing)
                submitted_file = response[0]

                # Save Submission to Submission Table
                newSubmission = FileSubmission(
                    getRequestID(submitted_file),
                    file.filename,
                    file_size,
                    response,
                    getMimeTypes(response),
                    getYaraHits(response),
                    getScannersRun(response),
                    getHashes(submitted_file),
                    request.remote_addr,
                    request.headers.get("User-Agent"),
                    user_id,
                    submitted_description,
                    submitted_at,
                    getRequestTime(submitted_file),
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
            current_app.logger.info(
                "failed to submit %s to strelka: %s", file.filename, e
            )
            return jsonify({"message": "strelka submission was not successful"}, 500)


def getRequestID(response):
    return (
        response["request"]["id"]
        if "request" in response and "id" in response["request"]
        else ""
    )


def getRequestTime(response):
    return (
        str(datetime.datetime.fromtimestamp(response["request"]["time"]))
        if "request" in response and "time" in response["request"]
        else ""
    )


def getMimeTypes(response):
    mimetypes = set()

    for r in response:
        for mimetype in r["file"]["flavors"]["mime"]:
            mimetypes.add(mimetype)
    return list(mimetypes)


def getScannersRun(response):
    scanners = set()

    for r in response:
        scanners.update(r["file"]["scanners"])
    return list(scanners)


def getYaraHits(response):
    yarahits = set()

    for r in response:
        for yarahit in r["scan"]["yara"]["matches"]:
            yarahits.add(yarahit)
    return list(yarahits)


def getHashes(response):
    hashes = (
        response["scan"]["hash"].copy()
        if "scan" in response and "hash" in response["scan"]
        else {}
    )
    del hashes["elapsed"]
    return hashes.items()


@strelka.route("/scans/stats")
@auth_required
def getScanStats(user):

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
@auth_required
def getScan(id):

    submission = (
        db.session.query(FileSubmission)
        .options(joinedload(FileSubmission.user))
        .filter_by(file_id=id)
        .first()
    )

    if submission is not None:
        return submissionsToJson(submission), 200
    else:
        return "not found", 404


@strelka.route("/scans", methods=["GET"])
@auth_required
def view(user):

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
        "items": list(map(lambda x: submissionsToJson(x), submissions.items)),
    }

    return paginated_ui, 200


def submissionsToJson(submission):
    val = submission.as_dict()
    val["user"] = submission.user.as_dict()
    return val
