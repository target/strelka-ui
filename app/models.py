from sqlalchemy.orm import relationship

from database import db


class FileSubmission(db.Model):
    __tablename__ = "file_submission"

    # Database Metadata
    id = db.Column(db.Integer, primary_key=True)

    # File Metadata
    file_id = db.Column(db.String(), unique=True)
    file_name = db.Column(db.String())
    file_size = db.Column(db.Integer())

    # Strelka Metadata
    strelka_response = db.Column(db.JSON())
    mime_types = db.Column(db.ARRAY(db.String(), dimensions=1))
    yara_hits = db.Column(db.ARRAY(db.String(), dimensions=1))
    scanners_run = db.Column(db.ARRAY(db.String(), dimensions=1))
    hashes = db.Column(db.ARRAY(db.String(), dimensions=2))

    # Submission Metadata
    submitted_from_ip = db.Column(db.String())
    submitted_from_client = db.Column(db.String())
    submitted_description = db.Column(db.String())
    submitted_by_user_id = db.Column(
        db.ForeignKey("user.id"), nullable=False, index=True
    )
    user = relationship("User", back_populates="submissions")
    submitted_at = db.Column(db.DateTime(), default=db.func.now(), index=True)
    processed_at = db.Column(db.DateTime())

    def __init__(
            self,
            file_id,
            file_name,
            file_size,
            strelka_response,
            mime_types,
            yara_hits,
            scanners_run,
            hashes,
            submitted_from_ip,
            submitted_from_client,
            submitted_by_user_id,
            submitted_description,
            submitted_at,
            processed_at,
    ):
        self.file_id = file_id
        self.file_name = file_name
        self.file_size = file_size
        self.strelka_response = strelka_response
        self.mime_types = mime_types
        self.yara_hits = yara_hits
        self.scanners_run = scanners_run
        self.hashes = hashes
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
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True)

    user_cn = db.Column(db.String(), unique=True)
    first_name = db.Column(db.String())
    last_name = db.Column(db.String())
    last_login = db.Column(db.DateTime())
    login_count = db.Column(db.Integer())
    files_submitted = db.Column(db.Integer())

    submissions = db.relationship("FileSubmission", back_populates="user")

    def __init__(
            self, user_cn, first_name, last_name, last_login, login_count, files_submitted
    ):
        self.user_cn = user_cn
        self.first_name = first_name
        self.last_name = last_name
        self.last_login = last_login
        self.login_count = login_count
        self.files_submitted = files_submitted

    def __repr__(self):
        return "<id {}>".format(self.id)

    def as_dict(self):
        return {c.name: getattr(self, c.name) for c in self.__table__.columns}


class ApiKey(db.Model):
    __tablename__ = "api_key"

    id = db.Column(db.Integer(), primary_key=True)
    key = db.Column(db.String(), unique=True, nullable=False)
    user_cn = db.Column(db.String(), db.ForeignKey('user.user_cn'), nullable=False)
    expiration = db.Column(db.DateTime())
