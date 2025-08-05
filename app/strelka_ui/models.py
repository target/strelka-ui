import datetime
import logging
from typing import List, Tuple

from sqlalchemy import inspect
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from strelka_ui.database import db
from strelka_ui.services.insights import get_insights

class FileSubmission(db.Model):
    """
    A model representing a file submission.

    Attributes:
        file_id (str): A unique identifier for the file.
        file_name (str): The name of the file.
        file_size (int): The size of the file in bytes.
        strelka_response (dict): A dictionary containing the response from the Strelka scanner.
        submitted_type (str): The type of submission that occurred (e.g., UI, VirusTotal)
        submitted_from_ip (str): The IP address of the client that submitted the file.
        submitted_from_client (str): The name of the client that submitted the file.
        submitted_description (str): A description of the file provided by the user.
        submitted_by_user_id (int): The ID of the user who submitted the file.
        user (User): The user who submitted the file.
        submitted_at (datetime.datetime): The date and time the file was submitted.
        processed_at (datetime.datetime): The date and time the file was processed.
        insights (list): A list of insights observed for submitted files.
        iocs (list): A list of iocs observed for submitted files.
        highest_vt_count (int): The highest number of VirusTotal hits for a file.
        highest_vt_sha256 (str): The SHA256 hash of the file with the highest number of VirusTotal hits.
        mime_type (str): The MIME type of the file.
        s3_key (str): S3 object key for stored file (for resubmission).
        s3_expires_at (datetime.datetime): When the S3 file expires and gets deleted.
    """

    __tablename__ = "file_submission"

    # Database Metadata
    id: int = db.Column(db.Integer, primary_key=True)

    # File Metadata
    file_id: str = db.Column(db.String(), unique=True)
    file_name: str = db.Column(db.String(), index=True)
    file_size: int = db.Column(db.Integer())

    # Strelka Metadata
    strelka_response: dict = db.Column(db.JSON())
    mime_types: list = db.Column(db.ARRAY(db.String(), dimensions=1))
    yara_hits: list = db.Column(db.ARRAY(db.String(), dimensions=1))
    files_seen: int = db.Column(db.Integer())
    scanners_run: list = db.Column(db.ARRAY(db.String(), dimensions=1))
    hashes: list = db.Column(db.ARRAY(db.String(), dimensions=2))
    insights: list = db.Column(db.ARRAY(db.String(), dimensions=1))
    iocs: list = db.Column(db.ARRAY(db.String(), dimensions=1))
    highest_vt_count: int = db.Column(db.Integer(), default=-1, nullable=False)
    highest_vt_sha256: str = db.Column(db.String())


    # Submission Metadata
    submitted_type: str = db.Column(db.String())
    submitted_from_ip: str = db.Column(db.String())
    submitted_from_client: str = db.Column(db.String())
    submitted_description: str = db.Column(db.String(), index=True)
    submitted_by_user_id: int = db.Column(
        db.ForeignKey("user.id"), nullable=False, index=True
    )
    user: "User" = relationship("User", back_populates="submissions")
    submitted_at: datetime.datetime = db.Column(
        db.DateTime(), default=func.now(), index=True
    )
    processed_at: datetime.datetime = db.Column(db.DateTime())

    # S3 Storage Metadata (for file resubmission)
    s3_key: str = db.Column(db.String(), nullable=True)
    s3_expires_at: datetime.datetime = db.Column(db.DateTime(), nullable=True)

    def __init__(
        self,
        file_name: str,
        file_size: int,
        strelka_response: dict,
        submitted_type: str,
        submitted_from_ip: str,
        submitted_from_client: str,
        submitted_by_user_id: int,
        submitted_description: str,
        submitted_at: datetime.datetime,
        s3_key: str = None,
        s3_expires_at: datetime.datetime = None,
    ):
        self.file_id = get_request_id(strelka_response[0]) # submitted_file
        self.file_name = file_name
        self.file_size = file_size
        self.strelka_response = strelka_response

        self.submitted_type = submitted_type
        self.submitted_from_ip = submitted_from_ip
        self.submitted_from_client = submitted_from_client
        self.submitted_by_user_id = submitted_by_user_id
        self.submitted_description = submitted_description
        self.submitted_at = submitted_at
        self.processed_at = get_request_time(strelka_response[0])

        # get vt count and sha useing get_highest_vt
        vt_count, vt_sha256 = get_highest_vt(strelka_response)
        self.highest_vt_count = vt_count
        self.highest_vt_sha256 = vt_sha256

        self.mime_types = get_mimetypes(strelka_response)
        self.yara_hits = get_yara_hits(strelka_response)
        self.scanners_run = get_scanners_run(strelka_response)
        self.files_seen = len(strelka_response)
        self.hashes = get_hashes(strelka_response[0])
        self.insights = get_all_insights(strelka_response)
        self.iocs = get_all_iocs(strelka_response)
        
        # S3 Storage fields
        self.s3_key = s3_key
        self.s3_expires_at = s3_expires_at


    def __repr__(self):
        return "<id {}>".format(self.id)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns if c.name not in inspect(self).unloaded}

def get_all_iocs(response: list):
    """
        Get Strelka Submission IoCs
        Store a set of IoCs in IoCs field
    """
    iocs = set()

    try:
        for scanned_file in response:
            if "iocs" in scanned_file:
                for ioc in scanned_file["iocs"]:
                    iocs.add(ioc["ioc"])
            else:
                pass
    except Exception as e:
        logging.warning(f"Could not process Insights search with error: {e} ")

    return iocs

def get_all_insights(response: list) -> list:
    """
    Get all insights from the Strelka response.
    
    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of insights.
    """
    
    insights = set()

    try:
        for index, scanned_file in enumerate(response):
            file_insights = get_insights(scanned_file)
            if file_insights:
                response[index]["insights"] = list(file_insights)
                insights.update(file_insights)
            else:
                pass
    except Exception as e:
        logging.warning(f"Could not process Insights search with error: {e} ")

    return insights

def get_request_id(response: dict) -> str:
    """
    Get the ID of the request from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        str: The ID of the request if it exists, otherwise an empty string.
    """
    return (
        response["request"]["id"]
        if "request" in response and "id" in response["request"]
        else ""
    )


def get_request_time(response: dict) -> str:
    """
    Get the time of the request from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        str: The time of the request if it exists, otherwise an empty string.
    """
    return (
        str(datetime.datetime.fromtimestamp(response["request"]["time"]))
        if "request" in response and "time" in response["request"]
        else ""
    )

def get_highest_vt(response: dict) -> Tuple[int, str]:
    """
    Get the highest number of VirusTotal hits and the corresponding SHA256 hash.

    Args:
        response (dict): The response from Strelka.

    Returns:
        int: The highest number of VirusTotal hits.
        str: The SHA256 hash of the file with the highest number of VirusTotal hits.
    """
    highest_vt_count = -1
    highest_vt_sha256 = ""

    for r in response:
        vt_count = r.get("enrichment", {}).get("virustotal", 0)
        if vt_count > highest_vt_count:
            highest_vt_count = vt_count
            highest_vt_sha256 = r["scan"]["hash"]["sha256"]

    return highest_vt_count, highest_vt_sha256


def get_mimetypes(response: list) -> list:
    """
    Get a list of unique MIME types found in the Strelka response.

    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of unique MIME types.
    """
    mimetypes = set()

    for r in response:
        for mimetype in r["file"]["flavors"]["mime"]:
            mimetypes.add(mimetype)
    return list(mimetypes)


def get_scanners_run(response: list) -> list:
    """
    Get a list of scanners that were run on the file in the Strelka response.

    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of scanner names.
    """
    scanners = set()

    for r in response:
        scanners.update(r["file"]["scanners"])
    return list(scanners)


def get_yara_hits(response: list) -> list:
    """
    Get a list of unique YARA rules that matched the file in the Strelka response.

    Args:
        response (list): The response from Strelka.

    Returns:
        list: A list of YARA rule names.
    """
    yarahits = set()

    for r in response:
        matches = r.get("scan", {}).get("yara", {}).get("matches")

        if not isinstance(matches, list):
            continue

        for yarahit in matches:
            yarahits.add(yarahit)
    return list(yarahits)

def get_hashes(response: dict) -> list:
    """
    Get a dictionary of hashes and their values from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        list: A list of (hash_type, hash_value) tuples.
    """
    hashes = (
        response["scan"]["hash"].copy()
        if "scan" in response and "hash" in response["scan"]
        else {}
    )
    del hashes["elapsed"]
    return hashes.items()

class User(db.Model):
    """
    Represents a user of the system.

    Attributes:
        id (int): The unique identifier of the user.
        user_cn (str): The common name of the user.
        first_name (str): The first name of the user.
        last_name (str): The last name of the user.
        last_login (datetime): The date and time of the user's last login.
        login_count (int): The number of times the user has logged in.
        files_submitted (int): The number of files submitted by the user.
        submissions (List[FileSubmission]): A list of file submissions made by the user.
    """

    __tablename__ = "user"

    id: int = db.Column(db.Integer, primary_key=True)
    user_cn: str = db.Column(db.String(), unique=True)
    first_name: str = db.Column(db.String())
    last_name: str = db.Column(db.String())
    last_login: datetime = db.Column(db.DateTime())
    login_count: int = db.Column(db.Integer())
    files_submitted: int = db.Column(db.Integer())

    submissions: List["FileSubmission"] = db.relationship(
        "FileSubmission", back_populates="user"
    )

    def __init__(
        self,
        user_cn: str,
        first_name: str,
        last_name: str,
        last_login: datetime,
        login_count: int,
        files_submitted: int,
    ) -> None:
        """
        Initializes a new instance of the User class.

        Args:
            user_cn (str): The common name of the user.
            first_name (str): The first name of the user.
            last_name (str): The last name of the user.
            last_login (datetime): The date and time of the user's last login.
            login_count (int): The number of times the user has logged in.
            files_submitted (int): The number of files submitted by the user.
        """
        self.user_cn = user_cn
        self.first_name = first_name
        self.last_name = last_name
        self.last_login = last_login
        self.login_count = login_count
        self.files_submitted = files_submitted

    def __repr__(self) -> str:
        """
        Returns a string representation of the user.

        Returns:
            str: A string representation of the user.
        """
        return f"<User id={self.id}>"

    def as_dict(self) -> dict:
        """
        Returns a dictionary representation of the user.

        Returns:
            dict: A dictionary representation of the user.
        """
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class ApiKey(db.Model):
    """
    Represents an API key used to access the system.

    Attributes:
        id (int): The unique identifier of the API key.
        key (str): The value of the API key.
        user_cn (str): The common name of the user associated with the API key.
        expiration (datetime): The date and time the API key expires.
    """

    __tablename__ = "api_key"

    id: int = db.Column(db.Integer, primary_key=True)
    key: str = db.Column(db.String(), unique=True, nullable=False)
    user_cn: str = db.Column(db.String(), db.ForeignKey("user.user_cn"), nullable=False)
    expiration: datetime = db.Column(db.DateTime())

    def __repr__(self) -> str:
        """
        Returns a string representation of the ApiKey object.
        """
        return f"<ApiKey id={self.id}, user_cn='{self.user_cn}'>"
