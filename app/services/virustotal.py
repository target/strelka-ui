import vt
import logging


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
            logging.warning(f"API Error: {e}")
            return -1
