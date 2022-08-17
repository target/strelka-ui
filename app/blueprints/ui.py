import os
from flask import Blueprint, send_from_directory, current_app

ui = Blueprint("ui", __name__, url_prefix="")

@ui.route('/', defaults={'path': ''})
@ui.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(current_app.static_folder + '/' + path):
        return send_from_directory(current_app.static_folder, path)
    else:
        return send_from_directory(current_app.static_folder, 'index.html')
