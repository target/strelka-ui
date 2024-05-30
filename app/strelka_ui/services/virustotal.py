import logging
from io import BytesIO
import os
import requests
import time


def get_virustotal_positives(api_key: str, file_hash: str) -> int:
    """
    Retrieves the count of malicious detections for a specific file from VirusTotal using the requests library.

    Args:
        api_key (str): The API key used to authenticate with the VirusTotal API.
        file_hash (str): The hash of the file (MD5, SHA1, or SHA256) to query for detections.

    Returns:
        int: The number of malicious detections found for the file. Returns -1 if an error occurs.
    """
    url = f"https://www.virustotal.com/api/v3/files/{file_hash}"
    headers = {"x-apikey": api_key}

    try:
        response = requests.get(url, headers=headers)
        if response.ok:
            file_analysis = response.json()
            logging.info(f"VirusTotal response: {str(response.json().get('data').get('id'))}")
            return (
                file_analysis.get("data", {})
                .get("attributes", {})
                .get("last_analysis_stats", {})
                .get("malicious", 0)
            )
        else:
            if response.status_code == 404:
                logging.info(f"Not found querying VirusTotal: {' '.join(response.text.split(os.linesep))}")
            else:
                logging.error(f"Error querying VirusTotal: {' '.join(response.text.split(os.linesep))}")

            return -1
    except Exception as e:
        logging.error(f"Exception querying VirusTotal: {e}")
        return -1


def create_vt_zip_and_download(api_key, file_hash, password, max_attempts=3):
    """
    Creates a password-protected ZIP file containing the specified file from VirusTotal,
    then downloads and returns it.

    Args:
        api_key (str): The API key for VirusTotal.
        file_hash (list): The hash of the file to download.
        password (str): The password to set for the ZIP file.
        max_attempts (int): The maximum number of attempts to check for ZIP readiness.

    Returns:
        BytesIO: A buffer containing the downloaded ZIP file.

    Raises:
        Exception: If any step in the process fails.
    """
    create_zip_url = "https://www.virustotal.com/api/v3/intelligence/zip_files"
    payload = {
        "data": {"password": password, "hashes": file_hash}
    }  # Assuming file_hash should be a list
    headers = {
        "x-apikey": api_key,
        "accept": "application/json",
        "content-type": "application/json",
    }
    response = requests.post(create_zip_url, json=payload, headers=headers)

    if not response.ok:
        raise Exception(f"Error creating ZIP: {response.text}")

    zip_id = response.json()["data"]["id"]

    check_zip_url = f"https://www.virustotal.com/api/v3/intelligence/zip_files/{zip_id}"
    attempts = 0
    while attempts < max_attempts:
        response = requests.get(check_zip_url, headers=headers)
        if not response.ok:
            raise Exception(f"Error checking ZIP status: {response.text}")

        if response.json()["data"]["attributes"]["status"] == "finished":
            break

        time.sleep(10)
        attempts += 1

    if attempts == max_attempts:
        raise Exception("Maximum polling attempts reached, ZIP file may not be ready.")

    get_download_url = f"{check_zip_url}/download_url"
    response = requests.get(get_download_url, headers=headers)

    if not response.ok:
        raise Exception(f"Error getting download URL: {response.text}")

    download_url = response.json()["data"]

    response = requests.get(download_url, headers={"x-apikey": api_key})
    if not response.ok:
        raise Exception(f"Error downloading ZIP: {response.text}")

    return BytesIO(response.content)


def download_vt_bytes(api_key: str, file_hash: str) -> BytesIO:
    """
    Downloads a file from VirusTotal and returns it as a byte stream using the requests library.

    Args:
        api_key (str): The API key for accessing VirusTotal.
        file_hash (str): The hash of the file to be downloaded.

    Returns:
        BytesIO: A buffer containing the downloaded file.

    Raises:
        Exception: If the download fails.
    """
    download_url = f"https://www.virustotal.com/api/v3/files/{file_hash}/download"
    headers = {"x-apikey": api_key}

    response = requests.get(download_url, headers=headers, stream=True)

    if response.ok:
        file_buffer = BytesIO(response.content)
        return file_buffer
    else:
        error_msg = f"Error downloading file from VirusTotal: {response.text}"
        logging.error(error_msg)
        raise Exception(error_msg)


def get_virustotal_widget_url(
    api_key: str, resource: str, fg1: str, bg1: str, bg2: str, bd1: str
) -> str:
    """
    Retrieves a URL for embedding the VirusTotal widget with customized theme colors.

    Args:
        api_key (str): The API key for accessing VirusTotal.
        resource (str): The resource identifier (file hash, URL, IP, or domain).
        fg1 (str): Theme primary foreground color in hex notation.
        bg1 (str): Theme primary background color in hex notation.
        bg2 (str): Theme secondary background color in hex notation.
        bd1 (str): Theme border color.

    Returns:
        str: A URL for embedding the VirusTotal widget with the specified theme.
    """
    url = f"https://www.virustotal.com/api/v3/widget/url?query={resource}&fg1={fg1}&bg1={bg1}&bg2={bg2}&bd1={bd1}"
    headers = {"x-apikey": api_key}

    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()
        widget_data = response.json()
        return widget_data.get("data", {}).get("url", "")
    except requests.HTTPError as http_err:
        logging.error(f"HTTP error occurred: {http_err}")
        raise
    except Exception as err:
        logging.error(f"An error occurred: {err}")
        raise
