"""
App entrypoint
"""

import logging
import os
import sys
from typing import Optional

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from paste.translogger import TransLogger
from waitress import serve

from strelka_ui.blueprints.auth import auth
from strelka_ui.blueprints.strelka import strelka
from strelka_ui.blueprints.ui import ui
from strelka_ui.models import db


def create_app() -> Flask:
    """Start and serve app assets and API endpoints"""
    load_dotenv()

    ui_folder: Optional[str] = os.environ.get("STATIC_ASSET_FOLDER", None)
    if ui_folder is None:
        ui_folder = "react-app"

    app: Flask = Flask(__name__, static_folder=ui_folder)
    app.logger.info("Serving app static assets from %s", ui_folder)

    # TODO: this is always false since config is not loaded. change to os.environ? will this break anything?
    if app.config.get("ENV") == "production":
        app.config.from_object("strelka_ui.config.config.ProductionConfig")
    else:
        app.config.from_object("strelka_ui.config.config.DevelopmentConfig")

    app.logger.info(
        "Using %s configuration",
        "production" if app.config.get("ENV") == "production" else "development",
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

    # Suppress thread wait warnings for Waitress
    waitress_logger = logging.getLogger("waitress.queue")
    waitress_logger.setLevel(logging.ERROR)

    main_app: Flask = create_app()

    serve(TransLogger(main_app, setup_console_handler=False), host="0.0.0.0", port=8080)

    # uncomment below for local flask app development with hot reloading
    # main_app.run(host="0.0.0.0", port=80, threaded=True)
