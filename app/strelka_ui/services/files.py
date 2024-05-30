import os
import tempfile
import zipfile
import rarfile
import py7zr
import mimetypes
import magic

from io import BytesIO
from werkzeug.datastructures import FileStorage
from typing import Tuple, List, Union


def decrypt_file(
        file_storage: FileStorage, password: str
) -> Tuple[bool, Union[str, List[FileStorage]]]:
    """
    Attempts to decrypt and unpack a file from an encrypted archive using the provided password.
    This function supports zip, rar, and 7z formats.

    Args:
        file_storage (FileStorage): The uploaded file storage from Flask.
        password (str): The password to attempt decryption with.

    Returns:
        Tuple[bool, Union[str, List[FileStorage]]]: A tuple containing a boolean indicating success,
        and either a list of FileStorage objects for each extracted file or an error message string.
    """
    try:
        # Save the uploaded file to a temporary file to handle it with different archive handlers
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        file_storage.save(temp_file.name)
        temp_file.close()

        # Use the python-magic library to identify the MIME type of the file
        magic_obj = magic.Magic(mime=True)
        mime_type = magic_obj.from_file(temp_file.name)

        # Handling different archive types using appropriate libraries
        if mime_type == "application/zip":
            with zipfile.ZipFile(temp_file.name, "r") as zfile:
                zfile.extractall(
                    path=os.path.dirname(temp_file.name), pwd=password.encode()
                )
                extracted_files = [
                    os.path.join(os.path.dirname(temp_file.name), name)
                    for name in zfile.namelist()
                ]

        elif mime_type in [
            "application/x-rar",
            "application/vnd.rar",
            "application/x-rar-compressed",
        ]:
            with rarfile.RarFile(temp_file.name, "r") as rfile:
                rfile.extractall(path=os.path.dirname(temp_file.name), pwd=password)
                extracted_files = [
                    os.path.join(os.path.dirname(temp_file.name), name)
                    for name in rfile.namelist()
                ]

        elif mime_type == "application/x-7z-compressed":
            with py7zr.SevenZipFile(
                    temp_file.name, mode="r", password=password
            ) as zfile:
                zfile.extractall(path=os.path.dirname(temp_file.name))
                extracted_files = [
                    os.path.join(os.path.dirname(temp_file.name), name)
                    for name in zfile.getnames()
                ]

        # Unsupported filetype
        else:
            return (
                False,
                f"Failed to extract files: file type {mime_type} is not supported for password extraction.",
            )

        # Prepare the extracted files as FileStorage objects for further processing
        return True, [prepare_decrypted_file(path) for path in extracted_files]

    except Exception as e:
        # Return a detailed error message if extraction fails
        return False, f"Failed to extract files: {str(e)}"
    finally:
        # Ensure that the temporary file is deleted after processing
        os.unlink(temp_file.name)


def prepare_decrypted_file(extracted_file_path: str) -> FileStorage:
    """
    Prepare a FileStorage object from an extracted file path.

    Args:
        extracted_file_path: Path to the extracted file.

    Returns:
        A FileStorage object.
    """
    with open(extracted_file_path, "rb") as file:
        buffer = BytesIO(file.read())
        mime_type, _ = mimetypes.guess_type(extracted_file_path)
        return FileStorage(
            stream=buffer,
            filename=os.path.basename(extracted_file_path),
            content_type=mime_type,
        )


def check_file_size(file_storage, max_size=150 * 1024 * 1024) -> Tuple[bool, int]:
    """
    Check if the file size exceeds the maximum allowed size.

    Args:
        file_storage: FileStorage object.
        max_size: Maximum file size in bytes.

    Returns:
        A tuple (is_valid, size) where is_valid is a boolean indicating if the file size is within the limit,
        and size is the size of the file.
    """
    # Move the cursor to the end of the file
    file_storage.seek(0, os.SEEK_END)

    # Get the position of the cursor, which is the size of the file
    file_size = file_storage.tell()

    # Rewind the cursor back to the start of the file for future operations
    file_storage.seek(0)

    return file_size <= max_size, file_size


def convert_bytesio_to_filestorage(file_bytes: BytesIO, filename: str) -> FileStorage:
    """
    Converts a BytesIO object into a FileStorage object to mimic file upload in Flask.

    Args:
        file_bytes (BytesIO): The byte stream of the file.
        filename (str): The name of the file, used to help identify the content type.

    Returns:
        FileStorage: A FileStorage object with the content of the byte stream.
    """
    # Guess the MIME type of the file based on the filename
    content_type, _ = mimetypes.guess_type(filename)

    # Create a FileStorage object
    file_storage = FileStorage(
        stream=file_bytes,
        filename=filename,
        content_type=content_type or "application/octet-stream",
    )

    return file_storage
