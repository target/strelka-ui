import json
import requests
from typing import Optional
from os import getenv

# Environment variables for configuration
api_base = getenv("STRELKA_API_BASE", "http://localhost:8080/api/strelka")
api_key = getenv("STRELKA_API_KEY", "")

# Define headers
headers = {
    "X-API-KEY": api_key,
    "Content-Type": "application/json",
    "Accept": "application/json",
}


# Helper function to handle requests
def make_request(method: str, url: str, **kwargs) -> Optional[str]:
    try:
        response = requests.request(method, url, headers=headers, **kwargs)
        response.raise_for_status()
        return response.text
    except requests.exceptions.HTTPError as e:
        print(f"HTTP Error: {e.response.status_code} for {url}: {e.response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Request Error: {e}")
    return None


# Endpoints
def get_scans_list(page: int = 1, per_page: int = 10) -> Optional[str]:
    return make_request("GET", f"{api_base}/scans?page={page}&per_page={per_page}")


def get_scan_by_id(scan_id: str) -> Optional[str]:
    return make_request("GET", f"{api_base}/scans/{scan_id}")


def upload_file(filename: str, description: str) -> Optional[str]:
    with open(filename, "rb") as f:
        files = {"file": (filename, f)}
        data = {"description": description, "password": ""}
        return make_request("POST", f"{api_base}/upload", files=files, data=data)


def upload_file_to_vt(file_hash: str, description: str) -> Optional[str]:
    """
    Sample Response:
    {"file_id":"07538964-b156-4ed3-93b4-85bcd07b5fbc",
    "results":[{"enrichment":{"virustotal":-1},"file":{"depth":0,"flavors":{"mime":["application/zip"],"yara":["encrypted_zip","zip_file"]}...
    }
    """
    payload = json.dumps({"description": description, "hash": file_hash})
    return make_request("POST", f"{api_base}/upload", data=payload)


if __name__ == "__main__":
    # Example usage
    # print(get_scans_list())
    # print(get_scan_by_id("<SCAN_ID>"))
    # print(upload_file("<FILEPATH_TO_FILE_TO_UPLOAD>", "This is a test file"))
    print(
        upload_file_to_vt(
            "5da8c98136d98dfec4716edd79c7145f", "VirusTotal Upload - Calc.exe"
        )
    )
