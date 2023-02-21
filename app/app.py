"""
App entrypoint
"""

import logging
import os
import sys

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate, upgrade
from paste.translogger import TransLogger
from waitress import serve

from blueprints.auth import auth
from blueprints.strelka import strelka
from blueprints.ui import ui
from models import db


def create_app():
    """Start and serve app assets and API endpoints"""
    load_dotenv()

    uiFolder = os.environ.get("STATIC_ASSET_FOLDER")
    if uiFolder is None:
        uiFolder = "react-app"

    app = Flask(__name__, static_folder=uiFolder)
    app.logger.info("Serving app static assets from %s", uiFolder)

    if app.config["ENV"] == "production":
        app.config.from_object("config.config.ProductionConfig")
    else:
        app.config.from_object("config.config.DevelopmentConfig")

    app.logger.info(
        "Using %s configuration",
        "production" if app.config["ENV"] == "production" else "development",
    )

    app.secret_key = app.config["SECRET_KEY"]
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    CORS(app, supports_credentials=True)
    db.init_app(app)

    # Initialize Flask-Migrate and associate it with the app
    migrate = Migrate(app, db)

    # register routes
    app.register_blueprint(ui)
    app.register_blueprint(auth, url_prefix="/api/auth")
    app.register_blueprint(strelka, url_prefix="/api/strelka")

    return app


if __name__ == "__main__":
    logging.basicConfig(stream=sys.stdout, level=logging.INFO)

    mainApp = create_app()

    serve(TransLogger(mainApp, setup_console_handler=False), host="0.0.0.0", port=8080)

    # uncomment below for local flask app development with hot reloading
    #mainApp.run(host='0.0.0.0', port=80, threaded=True)
