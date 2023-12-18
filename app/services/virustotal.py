import logging
from io import BytesIO
import requests
import time

import vt


def get_virustotal_positives(api_key: str, file_hash: str) -> int:
    """
    Queries the VirusTotal API for a given file hash and returns the count of
    positive detections and total scans.

    Parameters:
        api_key (str): VirusTotal API key.
        file_hash (str): The hash of the file to be queried.

    Returns:
        int: Count of positives (malicious)
    """
    with vt.Client(api_key) as client:
        try:
            # Retrieve the file analysis report from VirusTotal
            file_analysis = client.get_object(f"/files/{file_hash}")

            # Return positives count
            return file_analysis.last_analysis_stats["malicious"]

        except vt.error.APIError as e:
            logging.warning(f"VirusTotal Response: {e}")
            return -1


def create_vt_zip_and_download(api_key, file_hashes, password, max_attempts=3):
    # Step 1: Create a password-protected ZIP with VirusTotal files
    create_zip_url = "https://www.virustotal.com/api/v3/intelligence/zip_files"
    payload = {"data": {"password": password, "hashes": file_hashes}}
    headers = {
        "x-apikey": api_key,
        "accept": "application/json",
        "content-type": "application/json",
    }
    response = requests.post(create_zip_url, json=payload, headers=headers)

    if not response.ok:
        return Exception(f"Error creating ZIP: {response.text}")

    zip_id = response.json()["data"]["id"]

    # Step 2: Poll for the ZIP file’s status, up to max_attempts times
    check_zip_url = f"https://www.virustotal.com/api/v3/intelligence/zip_files/{zip_id}"
    attempts = 0
    while attempts < max_attempts:
        response = requests.get(check_zip_url, headers=headers)
        if not response.ok:
            return Exception(f"Error checking ZIP status: {response.text}")

        if response.json()["data"]["attributes"]["status"] == "finished":
            break

        time.sleep(10)  # Wait before polling again
        attempts += 1

    if attempts == max_attempts:
        return Exception(
            "Error: Maximum polling attempts reached, ZIP file may not be ready."
        )

    # Step 3: Get the ZIP file’s download URL
    get_download_url = f"{check_zip_url}/download_url"
    response = requests.get(get_download_url, headers=headers)

    if not response.ok:
        return Exception(f"Error getting download URL: {response.text}")

    download_url = response.json()["data"]

    # Step 4: Download the ZIP file into a BytesIO buffer
    response = requests.get(download_url, headers={"x-apikey": api_key})

    if not response.ok:
        return Exception(f"Error downloading ZIP: {response.text}")

    # Return a file-like object containing the downloaded ZIP file
    file_buffer = BytesIO(response.content)
    return file_buffer
