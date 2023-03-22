from typing import Optional

import requests

# Set API key and base URL
api_key = "<API_KEY>"
url_base = "http://0.0.0.0:8080/api/strelka"

# Define headers
headers = {
    "X-API-KEY": api_key,
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def get_scans_list(page: int = 1, per_page: int = 10) -> Optional[str]:
    """
    Get list of scans from the Strelka UI API.

    Args:
        page (int): The page number to retrieve. Defaults to 1.
        per_page (int): The number of items per page. Defaults to 10.

    Returns:
        Optional[str]: The list of scans as a JSON string if the request is successful, None otherwise.
    """
    url_route = f"/scans?page={page}&per_page={per_page}"
    try:
        response = requests.get(url_base + url_route, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


def get_scan_by_id(scan_id: str) -> Optional[str]:
    """
    Get scan details by ID from the Strelka UI API.

    Args:
        scan_id (str): The ID of the scan to retrieve.

    Returns:
        Optional[str]: The scan details as a JSON string if the request is successful, None otherwise.
    """
    url_route = f"/scans/{scan_id}"
    try:
        response = requests.get(url_base + url_route, headers=headers)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


def upload_file(filename: str, description: str) -> Optional[str]:
    """
    Upload a file to the Strelka UI API.

    Args:
        filename (str): The file path of the file to upload.
        description (str): The description of the file.

    Returns:
        Optional[str]: The response as a JSON string if the upload is successful, None otherwise.
    """
    url_route = "/upload"
    upload_headers = {
        "X-API-KEY": api_key,
    }

    try:
        with open(filename, "rb") as f:
            file_data = f.read()

        files = [("file", (filename, file_data))]
        data = {"description": description}

        response = requests.post(
            url_base + url_route, files=files, data=data, headers=upload_headers
        )
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Error: {e}")
        return None


if __name__ == "__main__":
    # Example usage
    print(get_scans_list())
    print(get_scan_by_id("<SCAN_ID>"))
    print(upload_file("<FILEPATH_TO_FILE_TO_UPLOAD>", "This is a test file"))
