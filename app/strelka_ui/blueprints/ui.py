import os
from typing import Any

from flask import Blueprint, current_app, send_from_directory

ui: Blueprint = Blueprint("ui", __name__, url_prefix="")


@ui.route("/", defaults={"path": ""})
@ui.route("/<path:path>")
def serve(path: str) -> Any:
    """
    Serve the static files from the Flask app's static folder.

    Parameters:
    -----------
    path: str
        The path to the file to serve.

    Returns:
    --------
    response: Any
        The Flask response object.
    """
    static_folder: str = current_app.static_folder

    print(os.path.join(static_folder, path))

    if path and os.path.exists(os.path.join(static_folder, path)):
        return send_from_directory(static_folder, path)
    else:
        return send_from_directory(static_folder, "index.html")


@ui.route("/health", methods=["GET"])
def health_check():
    """
    Health check

    Parameters:
    -----------
    None

    Returns:
    --------
    None
    """
    return "Hello"
