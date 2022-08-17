import json
import logging
from flask import current_app

from strelka.submit_to_strelka import submit_file_to_strelka


def submit_file(file, meta):
    logger = logging.getLogger("waitress")

    strelka_host = current_app.config["STRELKA_HOST"]
    strelka_port = current_app.config["STRELKA_PORT"]

    if file:
        sample_data = file.read()

        try:
            response = submit_file_to_strelka(
                file.filename,
                sample_data,
                f"{strelka_host}:{strelka_port}",
                meta,
            )

            return True, json.loads(response), len(sample_data)

        except Exception as e:
            logger.error(f"failed to submit {file.filename} to strelka: {e}")
            return False, {}, 0

    return False, {}, 0
