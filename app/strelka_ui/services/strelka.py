import errno
import logging
import socket
from typing import Any, Dict, Tuple

from flask import current_app

from strelka_ui.strelka.submit_to_strelka import submit_file_to_strelka


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


def submit_data(
    file: Any, meta: Dict[str, Any], file_hash: str, bypass_gatekeeper: bool = False
) -> Tuple[bool, str, int]:
    """
    Submit a file to Strelka for analysis and return the result.

    Args:
        file (Any): The file to be submitted.
        meta (dict): A dictionary of metadata to be included with the submission.
        file_hash (str): Used as a filename if uploading via VirusTotal
        bypass_gatekeeper (bool): If True, bypasses gatekeeper caching for this request.

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

        if file_hash:
            file_name = file_hash
        else:
            file_name = file.filename

        try:
            # Submit the file to Strelka using the submit_file_to_strelka() function
            response = submit_file_to_strelka(
                file_name,
                sample_data,
                f"{strelka_host}:{strelka_port}",
                meta,
                bypass_gatekeeper=bypass_gatekeeper,
            )

            # Return a tuple indicating success, the response from Strelka, and the file size
            if response:
                return True, response, len(sample_data)
            else:
                logger.error(
                    f"Failed to submit {file_name} to strelka. Please check the submitted file."
                )
                # Return a tuple indicating failure, an empty dictionary, and a file size of 0
                return (
                    False,
                    f"Failed to submit {file_name} to strelka. Please check the submitted file.",
                    0,
                )

        except Exception as e:
            logger.error(f"Failed to submit {file_name} to strelka: {e}")
            # Return a tuple indicating failure, an empty dictionary, and a file size of 0
            return False, f"Failed to submit {file_name} to strelka: {e}", 0

    # Return a tuple indicating failure, an empty dictionary, and a file size of 0
    return (
        False,
        f"Failed to submit file to strelka. Please check the submitted file.",
        0,
    )
