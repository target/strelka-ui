import logging
from datetime import datetime
from functools import wraps

from flask import current_app, request, session
import ldap3
from strelka_ui.models import ApiKey, User


# Define constants or configuration values
API_KEY_HEADER = "X-API-KEY"
SESSION_USER_ID_KEY = "user_id"


class UserNotAuthorized(Exception):
    pass


class APIKeyExpired(Exception):
    pass


class UserNotFound(Exception):
    pass


def authenticate_user():
    """
    Authenticate user based on session or API key.

    Returns:
        User: Authenticated user, or None if not authenticated.
    """
    # Check for session authentication
    if SESSION_USER_ID_KEY in session:
        # Authenticate using session
        user = User.query.filter_by(user_cn=session["user_cn"]).first()
        if user:
            return user

    # Check for API key authentication
    api_key = request.headers.get(API_KEY_HEADER, None)
    if api_key:
        db_key = ApiKey.query.filter_by(key=api_key).first()
        if db_key and datetime.now() <= db_key.expiration:
            user = User.query.filter_by(user_cn=db_key.user_cn).first()
            if user:
                return user
            else:
                logging.warning("User not found for API key %s", api_key)
                raise UserNotFound("User not found")
        else:
            logging.warning("API key %s has expired", api_key)
            raise APIKeyExpired("API key has expired")

    # logging.warning("User not authenticated")
    return None


def auth_required(f):
    """
    Decorator to authenticate user before executing a view function.

    Args:
        f: The view function to be decorated.

    Returns:
        The decorated view function.
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Authenticate user
            user = authenticate_user()
            if not user:
                # User not authenticated, raise UserNotAuthorized exception
                raise UserNotAuthorized("User not authorized")
            # User authenticated, call the original view function with the authenticated user
            return f(user, *args, **kwargs)
        except (UserNotAuthorized, UserNotFound, APIKeyExpired) as e:
            # Log and return error response with appropriate status code
            logging.warning(str(e))
            if isinstance(e, UserNotAuthorized):
                return "User not authorized", 401
            elif isinstance(e, UserNotFound):
                return "User not found", 401
            elif isinstance(e, APIKeyExpired):
                return "API key has expired", 401

    return decorated_function


def ldap_authenticate(username, password):
    """
    Authenticate user against LDAP server using provided username and password.

    Args:
        username (str): Username of user to authenticate.
        password (str): Password of user to authenticate.

    Returns:
        dict or None: Dictionary containing user information on success, None on failure.
    """
    try:
        # Configure LDAP server
        if current_app.config["STRELKA_CERT"]:
            # Use TLS encryption if STRELKA_CERT environment variable is set
            tls = ldap3.Tls(ca_certs_path=current_app.config["CA_CERT_PATH"])
            ldap_server = ldap3.Server(
                current_app.config["LDAP_URL"], port=636, tls=tls, use_ssl=True
            )
        else:
            # Use default LDAP connection if STRELKA_CERT environment variable is not set
            ldap_server = ldap3.Server(current_app.config["LDAP_URL"], port=636)

        # Connect to LDAP server with provided credentials
        with ldap3.Connection(
            ldap_server,
            current_app.config["LDAP_USERNAME_ORGANIZATION"] + username,
            password,
            auto_bind=True,
        ) as conn:
            # Search for user in LDAP directory
            conn.search(
                search_base=current_app.config["LDAP_SEARCH_BASE"],
                search_filter=f'({current_app.config["LDAP_ATTRIBUTE_ACCOUNT_NAME_FIELD"]}='
                + username
                + ")",
                search_scope="SUBTREE",
                attributes=[
                    current_app.config["LDAP_ATTRIBUTE_ACCOUNT_NAME_FIELD"],
                    current_app.config["LDAP_ATTRIBUTE_FIRST_NAME_FIELD"],
                    current_app.config["LDAP_ATTRIBUTE_LAST_NAME_FIELD"],
                    current_app.config["LDAP_ATTRIBUTE_MEMBER_OF_FIELD"],
                ],
            )

            # Get search results
            result = conn.response

            # Must have a record in AD as well as be a member of specific attribute.
            if result:
                if current_app.config["LDAP_ATTRIBUTE_MEMBER_REQUIREMENT_FIELD"]:
                    if not current_app.config[
                        "LDAP_ATTRIBUTE_MEMBER_REQUIREMENT_FIELD"
                    ] in str(result[0]["attributes"]["memberOf"]):
                        current_app.logger.info(
                            f"login failure for %s: requires {current_app.config['LDAP_ATTRIBUTE_MEMBER_REQUIREMENT_FIELD']} entitlement.",
                            username,
                        )
                        return None
                return {
                    "user_cn": str(
                        result[0]["attributes"]._store[
                            current_app.config["LDAP_ATTRIBUTE_ACCOUNT_NAME_FIELD"]
                        ]
                    ),
                    "first_name": str(
                        result[0]["attributes"]._store[
                            current_app.config["LDAP_ATTRIBUTE_FIRST_NAME_FIELD"]
                        ]
                    ),
                    "last_name": str(
                        result[0]["attributes"]._store[
                            current_app.config["LDAP_ATTRIBUTE_LAST_NAME_FIELD"]
                        ]
                    ),
                }

            # User not found in LDAP directory
            current_app.logger.info(
                "login failure for %s: failed to find username", username
            )
            return None

    # Handle LDAP authentication errors
    except ldap3.core.exceptions.LDAPBindError as e:
        current_app.logger.info("login failure for %s: %s", username, e)
        return None


def check_credentials(username, password):
    """
    Check user credentials and return user information if valid.

    Args:
        username (str): Username of user to authenticate.
        password (str): Password of user to authenticate.

    Returns:
        tuple: Tuple containing boolean indicating authentication success or failure and dictionary
        containing user information if authentication was successful, or an error message if it failed.
    """
    # Check if LDAP authentication is enabled
    if current_app.config["LDAP_URL"]:
        # Authenticate user against LDAP server
        user_info = ldap_authenticate(username, password)

        # Return user information if authentication succeeded
        if user_info is not None:
            return True, user_info

    else:
        # Return default user information for non-LDAP authentication
        user_info = {"user_cn": username, "first_name": "local", "last_name": "local"}
        return True, user_info

    # LDAP authentication failed
    return False, {"error": "Invalid username or password"}
