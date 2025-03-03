#!/bin/sh
cd /app/strelka_ui || exit
export FLASK_APP=strelka_ui.__main__:create_app
poetry run flask db upgrade
poetry run python -m strelka_ui
