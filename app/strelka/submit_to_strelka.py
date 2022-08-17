import os
import grpc
import strelka.strelka_pb2 as strelka_pb2
import strelka.strelka_pb2_grpc as strelka_pb2_grpc
from flask import current_app


def yield_file(filename, data, metadata, chunk=8192):
    for c in range(0, len(data), chunk):
        yield strelka_pb2.ScanFileRequest(
            data=data[c : c + chunk],
            request=strelka_pb2.Request(client="fileshot-webui"),
            attributes=strelka_pb2.Attributes(filename=filename, metadata=metadata),
        )


def submit_file_to_strelka(filename, data, host, metadict):
    while True:
        try:
            if os.environ.get("STRELKA_CERT"):
                with open(os.environ.get("STRELKA_CERT"), 'rb') as f:
                    cert = f.read()
                credentials = grpc.ssl_channel_credentials(cert)
                with grpc.secure_channel(target=host,
                                         credentials=credentials) as chan:
                    stub = strelka_pb2_grpc.FrontendStub(chan)
                    responses = stub.ScanFile(yield_file(filename, data, metadict), timeout=960)
                    responses = list(responses)
                    for r in responses:
                        return r.event
            else:
                chan = grpc.insecure_channel(host)
                stub = strelka_pb2_grpc.FrontendStub(chan)
                responses = stub.ScanFile(yield_file(filename, data, metadict), timeout=960)

                responses = list(responses)
                for r in responses:
                    return r.event

        except Exception as e:
            current_app.logger.error("error submitting %s: %s", filename, e)
            return ""
