"""
Authentication controller
"""

import datetime
from flask import Blueprint, current_app, request, session, jsonify
from jsonschema import validate, ValidationError

from database import db
from services.auth import check_credentials
from models import User

auth = Blueprint("auth", __name__, url_prefix="/auth")

loginSchema = {
    "type": "object",
    "properties": {
        "username": {"type": "string", "minLength": 2},
        "password": {"type": "string", "minLength": 3},
    },
    "required": ["username", "password"],
}


@auth.route("logout")
def logout():
    """Clears user session and returns logout message"""
    session.clear()
    return jsonify({"message": "successfully logged out"}), 200


@auth.route("/login", methods=["POST"])
def login():
    """Login handler to authenticate and create user session"""
    username = request.form.get("username")
    password = request.form.get("password")

    try:
        validate(
            instance={"username": username, "password": password}, schema=loginSchema
        )
    except ValidationError as err:
        current_app.logger.error("Failed login validation: %s", err)
        return jsonify({"error": "Failed to validate username/password"}), 400

    current_app.logger.info("received login attempt for user %s", username)
    success, ldapUser = check_credentials(username, password)
    if not success:
        return jsonify({"error": "incorrect username/password combination"}), 401

    current_app.logger.info("ldap auth suceeded for user %s", ldapUser["user_cn"])
    session["user_cn"] = ldapUser["user_cn"]
    session["first_name"] = ldapUser["first_name"]
    session["last_name"] = ldapUser["last_name"]

    # upsert the user record with the new last logged in time
    try:
        dbUser = db.session.query(User).filter_by(user_cn=session["user_cn"]).first()
        loginTime = str(datetime.datetime.utcnow())
        if dbUser is not None:
            dbUser.last_login = loginTime
            dbUser.login_count += 1
        else:
            dbUser = User(
                session["user_cn"],
                session["first_name"],
                session["last_name"],
                loginTime,
                1,
                0,
            )
            db.session.add(dbUser)
        db.session.commit()
        db.session.flush()

        # stored in the session and used to map submissions to users
        # without a lookup on the user submitting it.
        session["user_id"] = dbUser.id
        session["logged_in"] = True
    except Exception as err:
        current_app.logger.error("Failed connection to database: %s", err)
        return jsonify({"error": "Failed to connect to database"}), 400

    return (
        jsonify(
            {
                "user_name": session["user_cn"],
                "authenticated": True,
            }
        ),
        200,
    )
