import datetime
from typing import List

from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from strelka_ui.database import db


class FileSubmission(db.Model):
    """
    A model representing a file submission.

    Attributes:
        id (int): The primary key of the submission.
        file_id (str): A unique identifier for the file.
        file_name (str): The name of the file.
        file_size (int): The size of the file in bytes.
        strelka_response (dict): A dictionary containing the response from the Strelka scanner.
        mime_types (list): A list of MIME types associated with the file.
        yara_hits (list): A list of YARA rule IDs that matched the file.
        files_seen (int): A count of files seen during analysis.
        scanners_run (list): A list of scanners that were run on the file.
        hashes (list): A list of hashes associated with the file.
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
    """

    __tablename__ = "file_submission"

    # Database Metadata
    id: int = db.Column(db.Integer, primary_key=True)

    # File Metadata
    file_id: str = db.Column(db.String(), unique=True)
    file_name: str = db.Column(db.String())
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

    # Submission Metadata
    submitted_type: str = db.Column(db.String())
    submitted_from_ip: str = db.Column(db.String())
    submitted_from_client: str = db.Column(db.String())
    submitted_description: str = db.Column(db.String())
    submitted_by_user_id: int = db.Column(
        db.ForeignKey("user.id"), nullable=False, index=True
    )
    user: "User" = relationship("User", back_populates="submissions")
    submitted_at: datetime.datetime = db.Column(
        db.DateTime(), default=func.now(), index=True
    )
    processed_at: datetime.datetime = db.Column(db.DateTime())

    def __init__(
        self,
        file_id: str,
        file_name: str,
        file_size: int,
        strelka_response: dict,
        mime_types: list,
        yara_hits: list,
        files_seen: int,
        scanners_run: list,
        hashes: list,
        insights: list,
        iocs: list,
        submitted_type: str,
        submitted_from_ip: str,
        submitted_from_client: str,
        submitted_by_user_id: int,
        submitted_description: str,
        submitted_at: datetime.datetime,
        processed_at: datetime.datetime,
    ):
        self.file_id = file_id
        self.file_name = file_name
        self.file_size = file_size
        self.strelka_response = strelka_response
        self.mime_types = mime_types
        self.yara_hits = yara_hits
        self.files_seen = files_seen
        self.scanners_run = scanners_run
        self.hashes = hashes
        self.insights = insights
        self.iocs = iocs
        self.submitted_type = submitted_type
        self.submitted_from_ip = submitted_from_ip
        self.submitted_from_client = submitted_from_client
        self.submitted_by_user_id = submitted_by_user_id
        self.submitted_description = submitted_description
        self.submitted_at = submitted_at
        self.processed_at = processed_at

    def __repr__(self):
        return "<id {}>".format(self.id)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


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
