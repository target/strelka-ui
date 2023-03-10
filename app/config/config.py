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

    HTTP_PORT = 80
    UPLOAD_FOLDER = os.environ.get("UPLOAD_FOLDER", "/opt")
    STRELKA_HOST = os.environ.get("STRELKA_HOST", "strelka_frontend_1")
    STRELKA_PORT = os.environ.get("STRELKA_PORT", "57314")
    STRELKA_CERT = os.environ.get("STRELKA_CERT", "")
    LDAP_URL = os.environ.get("LDAP_URL", "")
    CA_CERT_PATH = os.environ.get("CA_CERT_PATH", "")
    STATIC_ASSET_FOLDER = os.environ.get("STATIC_ASSET_FOLDER", "../ui/build/")
    MIGRATION_DIRECTORY = os.environ.get("MIGRATION_DIRECTORY", "migrations")
    DATABASE_HOST = os.environ.get("DATABASE_HOST", "0.0.0.0")
    DATABASE_USERNAME = os.environ.get("DATABASE_USERNAME", "postgres")
    DATABASE_PASSWORD = os.environ.get("DATABASE_PASSWORD", "postgres")
    DATABASE_PORT = os.environ.get("DATABASE_PORT", "5432")
    DATABASE_DBNAME = os.environ.get("DATABASE_DBNAME", "strelka_ui")

    # Formatted for ease of use with flask-sqlalchemy
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DATABASE_USERNAME}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_DBNAME}"
    logging.info(f"connecting to database with {SQLALCHEMY_DATABASE_URI}")


class ProductionConfig(Config):
    UPLOAD_FOLDER = "/opt"
    STATIC_ASSET_FOLDER = "react-app"


class DevelopmentConfig(Config):
    DEBUG = True


class TestingConfig(Config):
    TESTING = True
