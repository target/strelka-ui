from importlib.metadata import version
import json
import os
import socket
from typing import Dict, List, Union

import grpc
from flask import current_app

import strelka_ui.strelka.strelka_pb2 as strelka_pb2
import strelka_ui.strelka.strelka_pb2_grpc as strelka_pb2_grpc


def yield_file(
    filename: str, data: bytes, metadata: Dict[str, Union[str, int]], chunk: int = 8192
) -> strelka_pb2.ScanFileRequest:
    """
    Generator function that yields ScanFileRequest for the given filename and data.

    Args:
        filename (str): The name of the file to scan.
        data (bytes): The file contents.
        metadata (Dict[str, Union[str, int]]): The metadata associated with the file.
        chunk (int): The chunk size to use when streaming the file data.

    Yields:
        strelka_pb2.ScanFileRequest: A ScanFileRequest object for each chunk of file data.
    """

    metadata.update({
        "client_name": "fileshot-webui",
        "client_hostname": socket.gethostname(),
        "client_version": version("strelka-ui"),
    })

    if os.environ.get("ENV"):
        metadata.update({
            "client_environment": os.environ.get("ENV"),
        })

    for c in range(0, len(data), chunk):
        yield strelka_pb2.ScanFileRequest(
            data=data[c : c + chunk],
            request=strelka_pb2.Request(client="fileshot-webui"),
            attributes=strelka_pb2.Attributes(filename=filename, metadata=metadata),
        )


def submit_file_to_strelka(
    filename: str, data: bytes, host: str, metadata: Dict[str, Union[str, int]]
) -> Union[List[Dict[str, Union[str, int]]], str]:
    """
    Submit the given file to Strelka for scanning.

    Args:
        filename (str): The name of the file to scan.
        data (bytes): The file contents.
        host (str): The URL of the Strelka service to connect to.
        metadata (Dict[str, Union[str, int]]): The metadata associated with the file.

    Returns:
        Union[List[Dict[str, Union[str, int]]], str]: A list of JSON events generated by Strelka, or an empty string if an error occurred.
    """
    try:
        if current_app.config["STRELKA_CERT"]:
            with open(current_app.config["STRELKA_CERT"], "rb") as f:
                cert = f.read()
            credentials = grpc.ssl_channel_credentials(cert)
            with grpc.secure_channel(target=host, credentials=credentials) as chan:
                stub = strelka_pb2_grpc.FrontendStub(chan)
                responses = stub.ScanFile(
                    yield_file(filename, data, metadata), timeout=960
                )
                return [json.loads(response.event) for response in responses]

        else:
            chan = grpc.insecure_channel(host)
            stub = strelka_pb2_grpc.FrontendStub(chan)
            responses = stub.ScanFile(yield_file(filename, data, metadata), timeout=960)
            return [json.loads(response.event) for response in responses]

    except Exception as e:
        current_app.logger.error("error submitting %s: %s", filename, e)
        return ""
