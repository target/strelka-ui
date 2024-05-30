import os
import logging


class Config(object):
    DEBUG = False
    TESTING = False

    if os.environ.get("COOKIE_SIGNING_SECRET_KEY") is not None:
        logging.info(
            "loaded cookie signing secret key from COOKIE_SIGNING_SECRET_KEY env var"
        )
        SECRET_KEY = os.environ.get("COOKIE_SIGNING_SECRET_KEY")
    else:
        logging.info("generated transient cookie signing secret key")
        SECRET_KEY = os.urandom(32)

    # Application Details
    HTTP_PORT = 80
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/opt")
    CA_CERT_PATH = os.environ.get("CA_CERT_PATH", "")
    STATIC_ASSET_FOLDER = os.environ.get("STATIC_ASSET_FOLDER", "../ui/build/")
    MIGRATION_DIRECTORY = os.environ.get("MIGRATION_DIRECTORY", "migrations")

    # Strelka Details
    STRELKA_HOST = os.environ.get("STRELKA_HOST", "0.0.0.0")
    STRELKA_PORT = os.environ.get("STRELKA_PORT", "57314")
    STRELKA_CERT = os.environ.get("STRELKA_CERT", "")

    # Database Details
    DATABASE_HOST = os.environ.get("DATABASE_HOST", "0.0.0.0")
    DATABASE_USERNAME = os.environ.get("DATABASE_USERNAME", "postgres")
    DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD", "postgres")
    DATABASE_PORT = os.environ.get("DATABASE_PORT", "5432")
    DATABASE_DBNAME = os.environ.get("DATABASE_DBNAME", "strelka_ui")

    # API Details
    VIRUSTOTAL_API_KEY = os.environ.get("VIRUSTOTAL_API_KEY", "")
    VIRUSTOTAL_API_LIMIT = os.environ.get("VIRUSTOTAL_API_LIMIT", 30)
    API_KEY_EXPIRATION = os.environ.get("API_KEY_EXPIRATION", "999")

    # LDAP Details
    LDAP_URL = os.environ.get("LDAP_URL", "")
    LDAP_SEARCH_BASE = os.environ.get("LDAP_SEARCH_BASE", "DC=corp,DC=*,DC=com")
    LDAP_USERNAME_ORGANIZATION = os.environ.get("LDAP_USERNAME_ORGANIZATION", "org\\")
    LDAP_ATTRIBUTE_ACCOUNT_NAME_FIELD = os.environ.get(
        "LDAP_ATTRIBUTE_ACCOUNT_NAME_FIELD", "AccountName"
    )
    LDAP_ATTRIBUTE_FIRST_NAME_FIELD = os.environ.get(
        "LDAP_ATTRIBUTE_FIRST_NAME_FIELD", "FirstName"
    )
    LDAP_ATTRIBUTE_LAST_NAME_FIELD = os.environ.get(
        "LDAP_ATTRIBUTE_LAST_NAME_FIELD", "LastName"
    )
    LDAP_ATTRIBUTE_MEMBER_OF_FIELD = os.environ.get(
        "LDAP_ATTRIBUTE_MEMBER_OF_FIELD", "memberOf"
    )
    LDAP_ATTRIBUTE_MEMBER_REQUIREMENT_FIELD = os.environ.get(
        "LDAP_ATTRIBUTE_MEMBER_REQUIREMENT_FIELD", "*"
    )

    # Formatted for ease of use with flask-sqlalchemy
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_DBNAME}"


class ProductionConfig(Config):
    UPLOAD_FOLDER = "/opt"
    STATIC_ASSET_FOLDER = "react-app"


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
