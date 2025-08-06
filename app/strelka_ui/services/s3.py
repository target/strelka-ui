import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Tuple
from io import BytesIO

import boto3
from botocore.exceptions import ClientError, NoCredentialsError
from werkzeug.datastructures import FileStorage


def is_s3_enabled() -> bool:
    """
    Check if S3 file resubmission feature is enabled.
    
    Returns:
        bool: True if S3 is configured and enabled, False otherwise.
    """
    return (
        os.environ.get("ENABLE_FILE_RESUBMISSION", "false").lower() == "true"
        and os.environ.get("S3_BUCKET_NAME")
        and os.environ.get("S3_ACCESS_KEY_ID")
        and os.environ.get("S3_SECRET_ACCESS_KEY")
    )


def get_s3_client():
    """
    Create and return an S3 client.
    
    Returns:
        boto3.client: S3 client instance.
        
    Raises:
        NoCredentialsError: If AWS credentials are not configured.
    """
    return boto3.client(
        's3',
        region_name=os.environ.get("S3_REGION", "us-east-1"),
        aws_access_key_id=os.environ.get("S3_ACCESS_KEY_ID"),
        aws_secret_access_key=os.environ.get("S3_SECRET_ACCESS_KEY"),
        endpoint_url=os.environ.get("S3_ENDPOINT_URL")
    )


def generate_s3_key(submission_id: str, filename: str) -> str:
    """
    Generate S3 object key for a file submission.
    
    Args:
        submission_id (str): Unique submission identifier.
        filename (str): Original filename.
        
    Returns:
        str: S3 object key in format: submissions/{submission_id}/{filename}
    """
    return f"submissions/{submission_id}/{filename}"


def calculate_expires_at(retention_days: Optional[int] = None) -> datetime:
    """
    Calculate when a file will expire based on retention policy.
    
    Args:
        retention_days (int, optional): Number of days to retain file. 
                                      Defaults to S3_FILE_RETENTION_DAYS env var or 30.
        
    Returns:
        datetime: When the file will expire.
    """
    if retention_days is None:
        retention_days = int(os.environ.get("S3_FILE_RETENTION_DAYS", 30))
    
    return datetime.utcnow() + timedelta(days=retention_days)


def is_file_expired(expires_at: datetime) -> bool:
    """
    Check if a file has expired.
    
    Args:
        expires_at (datetime): When the file expires.
        
    Returns:
        bool: True if file has expired, False otherwise.
    """
    return datetime.utcnow() > expires_at


def upload_file(file_storage: FileStorage, submission_id: str) -> Tuple[bool, Optional[str], Optional[str]]:
    """
    Upload a file to S3.
    
    Args:
        file_storage (FileStorage): The file to upload.
        submission_id (str): Unique submission identifier.
        
    Returns:
        Tuple[bool, Optional[str], Optional[str]]: 
            - Success status
            - S3 key if successful, None if failed
            - Error message if failed, None if successful
    """
    if not is_s3_enabled():
        return False, None, "S3 file resubmission is not enabled"
    
    try:
        s3_client = get_s3_client()
        bucket_name = os.environ.get("S3_BUCKET_NAME")
        s3_key = generate_s3_key(submission_id, file_storage.filename)
        
        # Reset file pointer to start
        file_storage.seek(0)
        
        # Upload file to S3
        s3_client.upload_fileobj(
            file_storage.stream,
            bucket_name,
            s3_key,
            ExtraArgs={
                'ContentType': file_storage.content_type or 'application/octet-stream',
                'Metadata': {
                    'original_filename': file_storage.filename,
                    'submission_id': submission_id,
                    'uploaded_at': datetime.utcnow().isoformat()
                }
            }
        )
        
        logging.info(f"Successfully uploaded file to S3: {s3_key}")
        return True, s3_key, None
        
    except NoCredentialsError:
        error_msg = "AWS credentials not found"
        logging.error(f"S3 upload failed: {error_msg}")
        return False, None, error_msg
        
    except ClientError as e:
        error_msg = f"S3 client error: {e}"
        logging.error(f"S3 upload failed: {error_msg}")
        return False, None, error_msg
        
    except Exception as e:
        error_msg = f"Unexpected error during S3 upload: {e}"
        logging.error(error_msg)
        return False, None, error_msg


def download_file(s3_key: str) -> Tuple[bool, Optional[FileStorage], Optional[str]]:
    """
    Download a file from S3.
    
    Args:
        s3_key (str): S3 object key.
        
    Returns:
        Tuple[bool, Optional[FileStorage], Optional[str]]:
            - Success status
            - FileStorage object if successful, None if failed
            - Error message if failed, None if successful
    """
    if not is_s3_enabled():
        return False, None, "S3 file resubmission is not enabled"
    
    try:
        s3_client = get_s3_client()
        bucket_name = os.environ.get("S3_BUCKET_NAME")
        
        # Create BytesIO buffer to store downloaded data
        file_buffer = BytesIO()
        
        # Download file from S3
        s3_client.download_fileobj(bucket_name, s3_key, file_buffer)
        
        # Get object metadata to extract original filename and content type
        response = s3_client.head_object(Bucket=bucket_name, Key=s3_key)
        metadata = response.get('Metadata', {})
        
        original_filename = metadata.get('original_filename', s3_key.split('/')[-1])
        content_type = response.get('ContentType', 'application/octet-stream')
        
        # Reset buffer pointer to start
        file_buffer.seek(0)
        
        # Create FileStorage object
        file_storage = FileStorage(
            stream=file_buffer,
            filename=original_filename,
            content_type=content_type
        )
        
        logging.info(f"Successfully downloaded file from S3: {s3_key}")
        return True, file_storage, None
        
    except ClientError as e:
        if e.response['Error']['Code'] == 'NoSuchKey':
            error_msg = f"File not found in S3: {s3_key}"
        else:
            error_msg = f"S3 client error: {e}"
        logging.error(f"S3 download failed: {error_msg}")
        return False, None, error_msg
        
    except Exception as e:
        error_msg = f"Unexpected error during S3 download: {e}"
        logging.error(error_msg)
        return False, None, error_msg


def delete_file(s3_key: str) -> Tuple[bool, Optional[str]]:
    """
    Delete a file from S3.
    
    Args:
        s3_key (str): S3 object key.
        
    Returns:
        Tuple[bool, Optional[str]]:
            - Success status
            - Error message if failed, None if successful
    """
    if not is_s3_enabled():
        return False, "S3 file resubmission is not enabled"
    
    try:
        s3_client = get_s3_client()
        bucket_name = os.environ.get("S3_BUCKET_NAME")
        
        s3_client.delete_object(Bucket=bucket_name, Key=s3_key)
        
        logging.info(f"Successfully deleted file from S3: {s3_key}")
        return True, None
        
    except ClientError as e:
        error_msg = f"S3 client error: {e}"
        logging.error(f"S3 delete failed: {error_msg}")
        return False, error_msg
        
    except Exception as e:
        error_msg = f"Unexpected error during S3 delete: {e}"
        logging.error(error_msg)
        return False, error_msg