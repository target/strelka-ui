import errno
import logging
import socket
from typing import Any, Dict, Tuple

from flask import current_app

from strelka.submit_to_strelka import submit_file_to_strelka


def get_frontend_status() -> bool:
    """
    Checks if the Strelka frontend is online.
    This is really only useful if using an external Strelka instance / DB.
    Prone to errors unless someone can figure out how to ping a local strelka container / postgresdb container

    Returns:
        bool: True if the frontend is online, False otherwise.
    """

    # Get logger instance for logging messages
    logger = logging.getLogger("waitress")

    # Get Strelka host and port from Flask application configuration
    strelka_host = current_app.config["STRELKA_HOST"]
    strelka_port = int(current_app.config["STRELKA_PORT"])

    try:
        # Create a connection to the Strelka frontend
        socket.create_connection((strelka_host, strelka_port), timeout=5)

        # If the connection is successful, return True
        return True

    except socket.error as e:
        # If the connection fails with a connection refused error, return False
        if e.errno == errno.ECONNREFUSED:
            return False

        # If the connection fails with any other error, log the error and return False
        else:
            logger.error(f"failed to contact {strelka_host} for a health check: {e}")
            return False


def get_db_status() -> bool:
    """
    Checks if the Strelka database is online.
    This is really only useful if using an external Strelka instance / DB.
    Prone to errors unless someone can figure out how to ping a local strelka container / postgresdb container

    Returns:
        bool: True if the database is online, False otherwise.
    """
    # Get logger instance for logging messages
    logger = logging.getLogger("waitress")

    # Get database host and port from Flask application configuration
    database_host = current_app.config["DATABASE_HOST"]
    database_port = int(current_app.config["DATABASE_PORT"])

    try:
        # Create a connection to the database
        socket.create_connection((database_host, database_port), timeout=5)

        # If the connection is successful, return True
        return True

    except socket.error as e:
        # If the connection fails with a connection refused error, return False
        if e.errno == errno.ECONNREFUSED:
            return False

        # If the connection fails with any other error, log the error and return False
        else:
            logger.error(f"failed to contact {database_host} for a health check: {e}")
            return False


def submit_data(file: Any, meta: Dict[str, Any]) -> Tuple[bool, Dict[str, Any], int]:
    """
    Submit a file to Strelka for analysis and return the result.

    Args:
        file (Any): The file to be submitted.
        meta (dict): A dictionary of metadata to be included with the submission.

    Returns:
        tuple: A tuple containing a boolean indicating whether the submission was successful,
            a dictionary containing the response from Strelka, and an integer representing the
            size of the submitted file.

    """
    logger = logging.getLogger("waitress")

    strelka_host = current_app.config["STRELKA_HOST"]
    strelka_port = current_app.config["STRELKA_PORT"]

    if file:
        sample_data = file.read()

        try:
            # Submit the file to Strelka using the submit_file_to_strelka() function
            response = submit_file_to_strelka(
                file.filename,
                sample_data,
                f"{strelka_host}:{strelka_port}",
                meta,
            )

            # Return a tuple indicating success, the response from Strelka, and the file size
            return True, response, len(sample_data)

        except Exception as e:
            logger.error(f"failed to submit {file.filename} to strelka: {e}")
            # Return a tuple indicating failure, an empty dictionary, and a file size of 0
            return False, {}, 0

    # Return a tuple indicating failure, an empty dictionary, and a file size of 0
    return False, {}, 0
