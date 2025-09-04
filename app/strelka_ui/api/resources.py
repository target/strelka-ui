"""
Flask-RESTX Resources for API documentation.
These resources mirror the Flask blueprint routes for documentation generation only.
"""

from flask_restx import Resource, fields
from strelka_ui.api import api
from flask_restx import Namespace, reqparse

# Create namespaces for documentation
strelka_ns = Namespace('strelka', description='File analysis and scan operations')

# Create namespaces for documentation
status_ns = Namespace('status', description='Service status operations')

# Register namespaces
api.add_namespace(strelka_ns)
api.add_namespace(status_ns)

# Define data models for request/response documentation
file_enrichment_model = api.model('FileEnrichment', {
    'virustotal': fields.Integer(description='VirusTotal detection count (-1 if not available)', example=-1),
})

file_flavors_model = api.model('FileFlavors', {
    'mime': fields.List(fields.String(), description='MIME type classifications', example=['text/plain']),
})

file_tree_model = api.model('FileTree', {
    'node': fields.String(description='Node ID (UUID)', example='b33fd34d-d34d-b33f-d34d-b33fd34db33f'),
    'root': fields.String(description='Root node ID (UUID)', example='b33fd34d-d34d-b33f-d34d-b33fd34db33f')
})

file_info_model = api.model('FileInfo', {
    'depth': fields.Integer(description='File extraction depth', example=0),
    'flavors': fields.Nested(file_flavors_model, description='File type classifications'),
    'name': fields.String(description='Original filename', example='what_is_this.zip'),
    'scanners': fields.List(fields.String, description='List of scanners run on the file', example=[
        "ScanEntropy", "ScanFooter", "ScanHash", "ScanHeader", "ScanTlsh", "ScanUrl", "ScanYara"
    ]),
    'size': fields.Integer(description='File size in bytes', example=375),
    'tree': fields.Nested(file_tree_model, description='File tree information')
})
scan_result_item_model = api.model('ScanResultItem', {
    'enrichment': fields.Nested(file_enrichment_model, description='External enrichment data'),
    'file': fields.Nested(file_info_model, description='File analysis information'),
    'insights': fields.List(fields.String, description='Analysis insights and warnings', example=[
        "The file extension .zip does not match the expected extension for its MIME type (text/plain)."
    ]),
    'request': fields.Raw(description='Submission request details', example={
        "attributes": {
            "filename": "what_is_this.txt",
            "metadata": {
                "client_hostname": "6fcf0edf63f0",
                "client_name": "fileshot-webui",
                "client_user_name": "zzz",
                "client_version": "2.43",
                "user_name": "zzz"
            }
        },
        "client": "fileshot-webui",
        "id": "cd5b191e-fb4f-4f65-bd19-419e9fd671ff",
        "time": 1757021129
    }),
    'scan': fields.Raw(description='Scanner results and metrics', example={
        "elapsed": 0.025438,
        "entropy": {
            "elapsed": 0.000047,
            "entropy": 3.909544287710923
        },
        "footer": {
            "backslash": "8491d1130cca92acae9ac6359957e2ee48a70a120f2e3bb40\\n",
            "elapsed": 0.000021,
            "footer": "8491d1130cca92acae9ac6359957e2ee48a70a120f2e3bb40\n"
        },
        "hash": {
            "elapsed": 0.000083,
            "md5": "b0a8dd80a71d8eaca3c0e5d75729a0c1",
            "sha1": "27829f80089897c963bb2e62194173558c2f3e54",
            "sha256": "5ba480a42c9f6352c9a7c69e5656278b761bbcb50dfb3775ea89cda7f1bbea79",
            "ssdeep": "6:ItMoWyVVLl14Tl7YqE57FEWLx4NV1rVsejrBeju9KRT80HXHUTWS+Adc8UUGXtSC:IaoWetl14Tl7sFiV1ruejIu9KTL3HaWx",
            "tlsh": "T1D7E061A9015A9D67457A703DC3243E202B1035B94FD5E5120064DBC7197567CE00C808"
        },
        "header": {
            "backslash": "425a68393141592653597971dda000016fd000600040033001",
            "elapsed": 0.000016,
            "header": "425a68393141592653597971dda000016fd000600040033001"
        },
        "tlsh": {
            "elapsed": 0.004797
        },
        "url": {
            "elapsed": 0.000065
        },
        "yara": {
            "elapsed": 0.019961,
            "information": [
                "re_mime_plain"
            ],
            "matches": [
                "re_mime_plain"
            ],
            "rules_loaded": 38823
        }
    })
})

upload_response_model = api.model('UploadResponse', {
    'file_id': fields.String(description='Unique submission identifier', example='d34db33f-d34d-b33f-d34d-b33fd34db33f'),
    'meta': fields.Nested(api.model('UploadMeta', {
        'file_size': fields.Integer(description='File size in bytes', example=375),
        'iocs': fields.List(fields.Raw, description='List of IOCs', example=[]),
        'vt_positives': fields.List(fields.Raw, description='VirusTotal positives', example=[])
    }), description='Submission metadata'),
    'original_submission_id': fields.String(description='Original submission ID', example='d34db33f-d34d-b33f-d34d-b33fd34db33f'),
    'response': fields.List(fields.Raw, description='Analysis results (full scan result objects)', example=[
        {
            "enrichment": {
                "virustotal": -1
            },
            "file": {
                "depth": 0,
                "flavors": {
                    "mime": [
                        "text/plain"
                    ]
                },
                "name": "what_is_this.zip",
                "scanners": [
                    "ScanEntropy",
                    "ScanFooter",
                    "ScanHash",
                    "ScanHeader",
                    "ScanTlsh",
                    "ScanUrl",
                    "ScanYara"
                ],
                "size": 375,
                "tree": {
                    "node": "b33fd34d-d34d-b33f-d34d-b33fd34db33f",
                    "root": "b33fd34d-d34d-b33f-d34d-b33fd34db33f"
                }
            },
            "insights": [
                "The file extension .zip does not match the expected extension for its MIME type (text/plain)."
            ],
            "request": {
                "attributes": {
                    "filename": "what_is_this.zip",
                    "metadata": {
                        "client_hostname": "d8ffbde683c9",
                        "client_name": "fileshot-webui",
                        "client_user_name": "zzz",
                        "client_version": "2.43",
                        "user_name": "zzz"
                    }
                },
                "client": "fileshot-webui",
                "id": "b33fd34d-d34d-b33f-d34d-b33fd34db33f",
                "time": 1757015047
            },
            "scan": {
                "elapsed": 0.030504,
                "entropy": {
                    "elapsed": 7.3e-05,
                    "entropy": 3.909544287710923
                },
                "footer": {
                    "backslash": "8491d1130cca92acae9ac6359957e2ee48a70a120f2e3bb40",
                    "elapsed": 3.1e-05,
                    "footer": "8491d1130cca92acae9ac6359957e2ee48a70a120f2e3bb40"
                },
                "hash": {
                    "elapsed": 0.000124,
                    "md5": "b0a8dd80a71d8eaca3c0e5d75729a0c1",
                    "sha1": "27829f80089897c963bb2e62194173558c2f3e54",
                    "sha256": "5ba480a42c9f6352c9a7c69e5656278b761bbcb50dfb3775ea89cda7f1bbea79",
                    "ssdeep": "6:ItMoWyVVLl14Tl7YqE57FEWLx4NV1rVsejrBeju9KRT80HXHUTWS+Adc8UUGXtSC:IaoWetl14Tl7sFiV1ruejIu9KTL3HaWx",
                    "tlsh": "T1D7E061A9015A9D67457A703DC3243E202B1035B94FD5E5120064DBC7197567CE00C808"
                },
                "header": {
                    "backslash": "425a68393141592653597971dda000016fd000600040033001",
                    "elapsed": 1.8e-05,
                    "header": "425a68393141592653597971dda000016fd000600040033001"
                },
                "tlsh": {
                    "elapsed": 0.004521
                },
                "url": {
                    "elapsed": 7.1e-05
                },
                "yara": {
                    "elapsed": 0.025137,
                    "information": [
                        "re_mime_plain"
                    ],
                    "matches": [
                        "re_mime_plain"
                    ],
                    "rules_loaded": 37337
                }
            }
        }
    ])
})

scan_stats_model = api.model('ScanStats', {
    'all_time': fields.Integer(description='Total number of scans performed (all time)', example=121),
    'seven_days': fields.Integer(description='Scans processed in the last 7 days', example=8),
    'thirty_days': fields.Integer(description='Scans processed in the last 30 days', example=76),
    'twentyfour_hours': fields.Integer(description='Scans processed in the last 24 hours', example=5)
})
month_mime_stats_model = api.model('MonthMimeStats', {
    # The response is a mapping of month (YYYY-MM) to another mapping of MIME type to count.
    # This is best represented as a Raw field, since the keys are dynamic.
    # Example matches the format you provided.
    'response': fields.Raw(description='Mapping of month (YYYY-MM) to MIME type counts', example={
        "2025-08": {
            "application/json": 5,
            "application/msword": 2,
            "application/octet-stream": 26,
            "application/pdf": 3,
            "application/pgp-keys": 2,
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document": 1,
            "application/x-dosexec": 13,
            "application/x-empty": 1,
            "application/x-mach-binary": 2,
            "application/zip": 58,
            "audio/mpeg": 6,
            "font/sfnt": 9,
            "image/bmp": 2,
            "image/jpeg": 6,
            "image/png": 13,
            "image/svg+xml": 5,
            "image/webp": 2,
            "text/html": 5,
            "text/plain": 64,
            "text/x-c++": 5,
            "text/x-script.python": 26,
            "text/x-shellscript": 5,
            "text/xml": 1
        },
        "2025-09": {
            "application/zip": 1,
            "audio/mpeg": 1,
            "text/plain": 8
        }
    })
})

scan_list_item_model = api.model('ScanListItem', {
    'id': fields.String(description='Submission ID', example='d34db33f-d34d-b33f-d34d-b33fd34db33f'),
    'filename': fields.String(description='Original filename', example='document.pdf'),
    'description': fields.String(description='User-provided description', example='Suspicious email attachment'),
    'submission_time': fields.String(description='Submission timestamp', example='2024-01-15T10:30:00Z'),
    'status': fields.String(description='Analysis status', example='completed'),
    'file_size': fields.Integer(description='File size in bytes', example=2048576)
})
scan_list_response_model = api.model('ScanListResponse', {
    'has_next': fields.Boolean(description='Whether there is a next page', example=True),
    'has_prev': fields.Boolean(description='Whether there is a previous page', example=False),
    'items': fields.List(fields.Raw, description='List of scan submissions'),
    'page': fields.Integer(description='Current page number', example=1),
    'pages': fields.Integer(description='Total number of pages', example=13),
    'per_page': fields.Integer(description='Results per page', example=10),
    'total': fields.Integer(description='Total number of scan submissions', example=121)
})

status_response_model = api.model('StatusResponse', {
    'message': fields.String(description='Status message', example='Strelka is reachable'),
})

vt_api_key_status_model = api.model('VTApiKeyStatus', {
    'apiKeyAvailable': fields.Boolean(description='Whether the API key is available', example=True)
})

# File upload parser for multipart/form-data
upload_parser = reqparse.RequestParser()
upload_parser.add_argument('file', location='files', type='file', required=False,
                          help='File to analyze (required if hash not provided)')
upload_parser.add_argument('description', type=str, location='form', required=True,
                          help='Description for the file submission')
upload_parser.add_argument('password', type=str, location='form', required=False,
                          help='Password for encrypted files (optional)')
upload_parser.add_argument('hash', type=str, location='form', required=False,
                          help='Hash to analyze (alternative to file upload)')

# Strelka namespace resources
@strelka_ns.route('/upload')
class StrelkaUpload(Resource):
    @strelka_ns.expect(upload_parser)
    @strelka_ns.doc(
        description='Submit a file or hash to Strelka for analysis. Either upload a file or provide a hash to analyze.',
        security='apikey',
        responses={
            200: ('File submitted successfully', upload_response_model),
            400: 'Bad request or validation error',
            413: 'File too large',
            500: 'Internal server error'
        }
    )
    def post(self):
        """Submit a file or hash for analysis
        
        This endpoint accepts either a file upload or a hash for analysis.
        Files are processed through the Strelka analysis engine and results
        include file metadata, YARA rule matches, and enrichment data.
        
        **File Upload Example:**
        ```bash
        curl -X POST "http://your-server/api/strelka/upload" -H "X-API-KEY: your-api-key-here" -F "file=@suspicious_file.exe" -F "description=Potential malware sample from email" -F "password=infected"
        ```
        
        **Hash Analysis Example:**
        ```bash
        curl -X POST "http://your-server/api/strelka/upload" -H "X-API-KEY: your-api-key-here" -H "Content-Type: application/json" -d '{{
              "hash": "5da8c98136d98dfec4716edd79c7145f",
              "description": "Known malware hash from threat intel"
                 }}'
        ```
        
        **Python Example:**
        ```python
        import requests
        
        headers = {{"X-API-KEY": "your-api-key-here"}}
        
        # File upload
        with open("suspicious_file.exe", "rb") as f:
            files = {{"file": ("suspicious_file.exe", f)}}
            data = {{"description": "Email attachment", "password": ""}}
            response = requests.post(
                "http://your-server/api/strelka/upload",
                headers=headers,
                files=files,
                data=data
            )
        
        # Hash analysis
        data = {{
            "hash": "5da8c98136d98dfec4716edd79c7145f",
            "description": "Threat intel hash"
        }}
        response = requests.post(
            "http://your-server/api/strelka/upload",
            headers=headers,
            json=data
        )
        ```
        
        """
        pass

@strelka_ns.route('/scans/stats')
class StrelkaScanStats(Resource):
    @strelka_ns.doc(
        description='Returns high level scan counts. Used to populate the stats info on the UI.',
        security='apikey',
        responses={
            200: ('Statistics retrieved successfully', scan_stats_model),
            401: 'Authentication required',
            500: 'Internal server error'
        }
    )
    def get(self):
        """Get overall scan statistics
        
        Returns aggregate statistics about scans processed by the system.
        Used by the UI dashboard to display key metrics.
        
        **cURL Example:**
        ```bash
        curl -X GET "http://your-server/api/strelka/scans/stats" -H "X-API-KEY: your-api-key-here"
        ```
        
        **Python Example:**
        ```python
        import requests
        
        headers = {{"X-API-KEY": "your-api-key-here"}}
        response = requests.get(
            "http://your-server/api/strelka/scans/stats",
            headers=headers
        )
        stats = response.json()
        print(f"Total scans: {{stats['total_scans']}}")
        ```
        """
        pass

@strelka_ns.route('/scans/mime-type-stats')
class StrelkaMimeTypeStats(Resource):
    @strelka_ns.doc(
        description='Get submission stats based on MIME Type. Used for UI dashboard.',
        security='apikey',
        responses={
            200: ('MIME type statistics retrieved successfully', month_mime_stats_model),
            401: 'Authentication required',
            500: 'Internal server error'
        }
    )
    def get(self):
        """Get MIME type distribution statistics
        
        Returns breakdown of file types processed in the last 6 months.
        Useful for understanding the types of files being analyzed.
        
        **cURL Example:**
        ```bash
        curl -X GET "http://your-server/api/strelka/scans/mime-type-stats" -H "X-API-KEY: your-api-key-here"
        ```
        """
        pass

@strelka_ns.route('/scans/<string:id>')
class StrelkaScanDetail(Resource):
    @strelka_ns.doc(
        description='Retrieve detailed scan results for a specific submission',
        security='apikey',
        params={'id': 'Unique submission ID (UUID format)'},
        responses={
            200: ('Scan details retrieved successfully', upload_response_model),
            401: 'Authentication required',
            404: 'Scan not found',
            500: 'Internal server error'
        }
    )
    def get(self, id):
        """Get detailed results for a specific scan
        
        Retrieves comprehensive analysis results for a previously submitted file.
        Includes all scanner outputs, enrichment data, and file metadata.
        
        **cURL Example:**
        ```bash
        curl -X GET "http://your-server/api/strelka/scans/d34db33f-d34d-b33f-d34d-b33fd34db33f" -H "X-API-KEY: your-api-key-here"
        ```
        
        **Python Example:**
        ```python
        import requests
        
        headers = {{"X-API-KEY": "your-api-key-here"}}
        scan_id = "d34db33f-d34d-b33f-d34d-b33fd34db33f"
        response = requests.get(
            f"{{}}/api/strelka/scans/{{scan_id}}",
            headers=headers
        )
        scan_results = response.json()
        ```
        """
        pass

@strelka_ns.route('/scans')
class StrelkaScans(Resource):
    @strelka_ns.doc(
        description='List scan submissions with pagination and filtering',
        security='apikey',
        params={
            'page': 'Page number for pagination (default: 1)',
            'per_page': 'Number of results per page (default: 10, max: 100)',
            'search': 'Search term for filtering by filename or description'
        },
        responses={
            200: ('Scan list retrieved successfully', scan_list_response_model),
            401: 'Authentication required',
            500: 'Internal server error'
        }
    )
    def get(self):
        """List scan submissions with pagination
        
        Returns a paginated list of scan submissions. Supports filtering
        by search terms and pagination controls.
        
        **cURL Examples:**
        ```bash
        # Get first page of scans
        curl -X GET "http://your-server/api/strelka/scans" -H "X-API-KEY: your-api-key-here"
        
        # Get second page with 20 results per page
        curl -X GET "http://your-server/api/strelka/scans?page=2&per_page=20" -H "X-API-KEY: your-api-key-here"
        
        # Search for specific files
        curl -X GET "http://your-server/api/strelka/scans?search=malware" -H "X-API-KEY: your-api-key-here"
        ```
        
        **Python Example:**
        ```python
        import requests
        
        headers = {{"X-API-KEY": "your-api-key-here"}}
        params = {{"page": 1, "per_page": 10, "search": "suspicious"}}
        response = requests.get(
            "http://your-server/api/strelka/scans",
            headers=headers,
            params=params
        )
        scans = response.json()
        ```
        """
        pass

@strelka_ns.route('/resubmit/<string:submission_id>')
class StrelkaResubmit(Resource):
    @strelka_ns.doc(
        description='Resubmit a scan ID for analysis. This bypasses all caching to ensure the file is rescanned.',
        security='apikey',
        params={'submission_id': 'Original submission ID to resubmit (UUID format)'},
        responses={
            200: ('File resubmitted successfully', upload_response_model),
            401: 'Authentication required',
            404: 'Original submission not found',
            500: 'Internal server error'
        }
    )
    def post(self, submission_id):
        """Resubmit a previously scanned file for analysis

        Forces a fresh analysis of a previously submitted file, bypassing
        all caches. Useful when scanners have been updated or you need
        a new analysis with current threat intelligence.

        **cURL Example:**
        ```bash
        curl -X POST "http://your-server/api/strelka/resubmit/d34db33f-d34d-b33f-d34d-b33fd34db33f" -H "X-API-KEY: your-api-key-here"
        ```

        **Python Example:**
        ```python
        import requests

        headers = {{"X-API-KEY": "your-api-key-here"}}
        submission_id = "d34db33f-d34d-b33f-d34d-b33fd34db33f"
        response = requests.post(
            f"{{}}/api/strelka/resubmit/{{submission_id}}",
            headers=headers
        )
        resubmit_results = response.json()
        ```
        """
        pass

@strelka_ns.route('/status/strelka')
class StrelkaServerStatus(Resource):
    @strelka_ns.doc(
        description='Check if Strelka analysis engine is reachable',
        responses={
            200: ('Strelka is reachable', status_response_model),
            500: ('Strelka is not reachable', status_response_model)
        }
    )
    def get(self):
        """Check Strelka analysis engine connectivity
        
        Verifies that the Strelka analysis backend is accessible and
        responding to requests. Used for health monitoring.
        
        **cURL Example:**
        ```bash
        curl -X GET "http://your-server/api/strelka/status/strelka"
        ```
        
        **Python Example:**
        ```python
        import requests
        
        response = requests.get("http://your-server/api/strelka/status/strelka")
        status = response.json()
        print(f"Strelka status: {{status['status']}}")
        ```
        """
        pass

@strelka_ns.route('/status/database')
class StrelkaDatabaseStatus(Resource):
    @strelka_ns.doc(
        description='Check if database is reachable and responding',
        responses={
            200: ('Database is reachable', status_response_model),
            500: ('Database is not reachable', status_response_model)
        }
    )
    def get(self):
        """Check database connectivity and health
        
        Verifies that the database backend is accessible and responding
        to queries. Used for health monitoring and troubleshooting.
        
        **cURL Example:**
        ```bash
        curl -X GET "http://your-server/api/strelka/status/database"
        ```
        
        **Python Example:**
        ```python
        import requests

        response = requests.get("http://your-server/api/strelka/status/database")
        db_status = response.json()
        print(f"Database status: {{db_status['status']}}")
        ```
        """
        pass

@strelka_ns.route('/check_vt_api_key')
class StrelkaCheckVTAPIKey(Resource):
    @strelka_ns.doc(
        description='Check if VirusTotal API key is configured',
        responses={
            200: ('API key status retrieved', vt_api_key_status_model),
            500: 'Internal server error'
        }
    )
    def get(self):
        """Check VirusTotal API key configuration
        
        Verifies whether a VirusTotal API key is configured in the environment.
        Used by the UI to determine whether VirusTotal enrichment features
        should be available.
        
        **cURL Example:**
        ```bash
        curl -X GET "http://your-server/api/strelka/check_vt_api_key"
        ```
        
        **Python Example:**
        ```python
        import requests
        
        response = requests.get("http://your-server/api/strelka/check_vt_api_key")
        vt_status = response.json()
        if vt_status['apiKeyAvailable']:
            print("VirusTotal API key is configured")
        else:
            print("VirusTotal API key is not configured")
        ```
        """
        pass