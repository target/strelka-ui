#!/bin/sh
export FLASK_APP=/app/app.py
flask db init
flask db migrate
flask db upgrade
python app.py
