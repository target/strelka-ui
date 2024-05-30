# Generated by the protocol buffer compiler.  DO NOT EDIT!
# source: strelka/proto/strelka.proto

import sys

_b = sys.version_info[0] < 3 and (lambda x: x) or (lambda x: x.encode('latin1'))
from google.protobuf import descriptor as _descriptor
from google.protobuf import message as _message
from google.protobuf import reflection as _reflection
from google.protobuf import symbol_database as _symbol_database

# @@protoc_insertion_point(imports)

_sym_db = _symbol_database.Default()

DESCRIPTOR = _descriptor.FileDescriptor(
    name='strelka/proto/strelka.proto',
    package='',
    syntax='proto3',
    serialized_options=None,
    serialized_pb=_b(
        '\n\x1bstrelka/proto/strelka.proto\"5\n\x07Request\x12\n\n\x02id\x18\x01 \x01(\t\x12\x0e\n\x06\x63lient\x18\x02 \x01(\t\x12\x0e\n\x06source\x18\x03 \x01(\t\"|\n\nAttributes\x12\x10\n\x08\x66ilename\x18\x01 \x01(\t\x12+\n\x08metadata\x18\x02 \x03(\x0b\x32\x19.Attributes.MetadataEntry\x1a/\n\rMetadataEntry\x12\x0b\n\x03key\x18\x01 \x01(\t\x12\r\n\x05value\x18\x02 \x01(\t:\x02\x38\x01\"[\n\x0fScanFileRequest\x12\x0c\n\x04\x64\x61ta\x18\x01 \x01(\x0c\x12\x19\n\x07request\x18\x02 \x01(\x0b\x32\x08.Request\x12\x1f\n\nattributes\x18\x03 \x01(\x0b\x32\x0b.Attributes\"Z\n\x0fScanHttpRequest\x12\x0b\n\x03url\x18\x01 \x01(\t\x12\x19\n\x07request\x18\x02 \x01(\x0b\x32\x08.Request\x12\x1f\n\nattributes\x18\x03 \x01(\x0b\x32\x0b.Attributes\")\n\x0cScanResponse\x12\n\n\x02id\x18\x01 \x01(\t\x12\r\n\x05\x65vent\x18\x02 \x01(\t2=\n\x08\x46rontend\x12\x31\n\x08ScanFile\x12\x10.ScanFileRequest\x1a\r.ScanResponse\"\x00(\x01\x30\x01\x62\x06proto3')
)

_REQUEST = _descriptor.Descriptor(
    name='Request',
    full_name='Request',
    filename=None,
    file=DESCRIPTOR,
    containing_type=None,
    fields=[
        _descriptor.FieldDescriptor(
            name='id', full_name='Request.id', index=0,
            number=1, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='client', full_name='Request.client', index=1,
            number=2, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='source', full_name='Request.source', index=2,
            number=3, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
    ],
    extensions=[
    ],
    nested_types=[],
    enum_types=[
    ],
    serialized_options=None,
    is_extendable=False,
    syntax='proto3',
    extension_ranges=[],
    oneofs=[
    ],
    serialized_start=31,
    serialized_end=84,
)

_ATTRIBUTES_METADATAENTRY = _descriptor.Descriptor(
    name='MetadataEntry',
    full_name='Attributes.MetadataEntry',
    filename=None,
    file=DESCRIPTOR,
    containing_type=None,
    fields=[
        _descriptor.FieldDescriptor(
            name='key', full_name='Attributes.MetadataEntry.key', index=0,
            number=1, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='value', full_name='Attributes.MetadataEntry.value', index=1,
            number=2, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
    ],
    extensions=[
    ],
    nested_types=[],
    enum_types=[
    ],
    serialized_options=_b('8\001'),
    is_extendable=False,
    syntax='proto3',
    extension_ranges=[],
    oneofs=[
    ],
    serialized_start=163,
    serialized_end=210,
)

_ATTRIBUTES = _descriptor.Descriptor(
    name='Attributes',
    full_name='Attributes',
    filename=None,
    file=DESCRIPTOR,
    containing_type=None,
    fields=[
        _descriptor.FieldDescriptor(
            name='filename', full_name='Attributes.filename', index=0,
            number=1, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='metadata', full_name='Attributes.metadata', index=1,
            number=2, type=11, cpp_type=10, label=3,
            has_default_value=False, default_value=[],
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
    ],
    extensions=[
    ],
    nested_types=[_ATTRIBUTES_METADATAENTRY, ],
    enum_types=[
    ],
    serialized_options=None,
    is_extendable=False,
    syntax='proto3',
    extension_ranges=[],
    oneofs=[
    ],
    serialized_start=86,
    serialized_end=210,
)

_SCANFILEREQUEST = _descriptor.Descriptor(
    name='ScanFileRequest',
    full_name='ScanFileRequest',
    filename=None,
    file=DESCRIPTOR,
    containing_type=None,
    fields=[
        _descriptor.FieldDescriptor(
            name='data', full_name='ScanFileRequest.data', index=0,
            number=1, type=12, cpp_type=9, label=1,
            has_default_value=False, default_value=_b(""),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='request', full_name='ScanFileRequest.request', index=1,
            number=2, type=11, cpp_type=10, label=1,
            has_default_value=False, default_value=None,
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='attributes', full_name='ScanFileRequest.attributes', index=2,
            number=3, type=11, cpp_type=10, label=1,
            has_default_value=False, default_value=None,
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
    ],
    extensions=[
    ],
    nested_types=[],
    enum_types=[
    ],
    serialized_options=None,
    is_extendable=False,
    syntax='proto3',
    extension_ranges=[],
    oneofs=[
    ],
    serialized_start=212,
    serialized_end=303,
)

_SCANHTTPREQUEST = _descriptor.Descriptor(
    name='ScanHttpRequest',
    full_name='ScanHttpRequest',
    filename=None,
    file=DESCRIPTOR,
    containing_type=None,
    fields=[
        _descriptor.FieldDescriptor(
            name='url', full_name='ScanHttpRequest.url', index=0,
            number=1, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='request', full_name='ScanHttpRequest.request', index=1,
            number=2, type=11, cpp_type=10, label=1,
            has_default_value=False, default_value=None,
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='attributes', full_name='ScanHttpRequest.attributes', index=2,
            number=3, type=11, cpp_type=10, label=1,
            has_default_value=False, default_value=None,
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
    ],
    extensions=[
    ],
    nested_types=[],
    enum_types=[
    ],
    serialized_options=None,
    is_extendable=False,
    syntax='proto3',
    extension_ranges=[],
    oneofs=[
    ],
    serialized_start=305,
    serialized_end=395,
)

_SCANRESPONSE = _descriptor.Descriptor(
    name='ScanResponse',
    full_name='ScanResponse',
    filename=None,
    file=DESCRIPTOR,
    containing_type=None,
    fields=[
        _descriptor.FieldDescriptor(
            name='id', full_name='ScanResponse.id', index=0,
            number=1, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
        _descriptor.FieldDescriptor(
            name='event', full_name='ScanResponse.event', index=1,
            number=2, type=9, cpp_type=9, label=1,
            has_default_value=False, default_value=_b("").decode('utf-8'),
            message_type=None, enum_type=None, containing_type=None,
            is_extension=False, extension_scope=None,
            serialized_options=None, file=DESCRIPTOR),
    ],
    extensions=[
    ],
    nested_types=[],
    enum_types=[
    ],
    serialized_options=None,
    is_extendable=False,
    syntax='proto3',
    extension_ranges=[],
    oneofs=[
    ],
    serialized_start=397,
    serialized_end=438,
)

_ATTRIBUTES_METADATAENTRY.containing_type = _ATTRIBUTES
_ATTRIBUTES.fields_by_name['metadata'].message_type = _ATTRIBUTES_METADATAENTRY
_SCANFILEREQUEST.fields_by_name['request'].message_type = _REQUEST
_SCANFILEREQUEST.fields_by_name['attributes'].message_type = _ATTRIBUTES
_SCANHTTPREQUEST.fields_by_name['request'].message_type = _REQUEST
_SCANHTTPREQUEST.fields_by_name['attributes'].message_type = _ATTRIBUTES
DESCRIPTOR.message_types_by_name['Request'] = _REQUEST
DESCRIPTOR.message_types_by_name['Attributes'] = _ATTRIBUTES
DESCRIPTOR.message_types_by_name['ScanFileRequest'] = _SCANFILEREQUEST
DESCRIPTOR.message_types_by_name['ScanHttpRequest'] = _SCANHTTPREQUEST
DESCRIPTOR.message_types_by_name['ScanResponse'] = _SCANRESPONSE
_sym_db.RegisterFileDescriptor(DESCRIPTOR)

Request = _reflection.GeneratedProtocolMessageType('Request', (_message.Message,), dict(
    DESCRIPTOR=_REQUEST,
    __module__='strelka.proto.strelka_pb2'
    # @@protoc_insertion_point(class_scope:Request)
))
_sym_db.RegisterMessage(Request)

Attributes = _reflection.GeneratedProtocolMessageType('Attributes', (_message.Message,), dict(

    MetadataEntry=_reflection.GeneratedProtocolMessageType('MetadataEntry', (_message.Message,), dict(
        DESCRIPTOR=_ATTRIBUTES_METADATAENTRY,
        __module__='strelka.proto.strelka_pb2'
        # @@protoc_insertion_point(class_scope:Attributes.MetadataEntry)
    ))
    ,
    DESCRIPTOR=_ATTRIBUTES,
    __module__='strelka.proto.strelka_pb2'
    # @@protoc_insertion_point(class_scope:Attributes)
))
_sym_db.RegisterMessage(Attributes)
_sym_db.RegisterMessage(Attributes.MetadataEntry)

ScanFileRequest = _reflection.GeneratedProtocolMessageType('ScanFileRequest', (_message.Message,), dict(
    DESCRIPTOR=_SCANFILEREQUEST,
    __module__='strelka.proto.strelka_pb2'
    # @@protoc_insertion_point(class_scope:ScanFileRequest)
))
_sym_db.RegisterMessage(ScanFileRequest)

ScanHttpRequest = _reflection.GeneratedProtocolMessageType('ScanHttpRequest', (_message.Message,), dict(
    DESCRIPTOR=_SCANHTTPREQUEST,
    __module__='strelka.proto.strelka_pb2'
    # @@protoc_insertion_point(class_scope:ScanHttpRequest)
))
_sym_db.RegisterMessage(ScanHttpRequest)

ScanResponse = _reflection.GeneratedProtocolMessageType('ScanResponse', (_message.Message,), dict(
    DESCRIPTOR=_SCANRESPONSE,
    __module__='strelka.proto.strelka_pb2'
    # @@protoc_insertion_point(class_scope:ScanResponse)
))
_sym_db.RegisterMessage(ScanResponse)

_ATTRIBUTES_METADATAENTRY._options = None

_FRONTEND = _descriptor.ServiceDescriptor(
    name='Frontend',
    full_name='Frontend',
    file=DESCRIPTOR,
    index=0,
    serialized_options=None,
    serialized_start=440,
    serialized_end=501,
    methods=[
        _descriptor.MethodDescriptor(
            name='ScanFile',
            full_name='Frontend.ScanFile',
            index=0,
            containing_service=None,
            input_type=_SCANFILEREQUEST,
            output_type=_SCANRESPONSE,
            serialized_options=None,
        ),
    ])
_sym_db.RegisterServiceDescriptor(_FRONTEND)

DESCRIPTOR.services_by_name['Frontend'] = _FRONTEND

# @@protoc_insertion_point(module_scope)