#!/bin/sh
cd /app/strelka_ui || exit
export FLASK_APP=strelka_ui.__main__:create_app
flask db init
flask db migrate
flask db upgrade
poetry run python -m strelka_ui
