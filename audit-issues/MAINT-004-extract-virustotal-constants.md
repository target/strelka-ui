# Extract VirusTotal API URLs to Constants

## Issue Type
Code Quality / Maintainability

## Priority
🟢 Low

## Description
VirusTotal API URLs are hardcoded throughout the `virustotal.py` file, making them difficult to test, mock, and potentially update.

## Location
`app/strelka_ui/services/virustotal.py`

## Current Code (5 occurrences)
```python
# Line 19
url = f"https://www.virustotal.com/api/v3/files/{file_hash}"

# Line 62
create_zip_url = "https://www.virustotal.com/api/v3/intelligence/zip_files"

# Line 78
check_zip_url = f"https://www.virustotal.com/api/v3/intelligence/zip_files/{zip_id}"

# Line 123
download_url = f"https://www.virustotal.com/api/v3/files/{file_hash}/download"

# Line 154
url = f"https://www.virustotal.com/api/v3/widget/url?query={resource}&fg1={fg1}..."
```

## Problems
1. **Hard to Test:** Can't easily mock or redirect to test API
2. **Configuration:** Can't switch to different endpoints (e.g., enterprise)
3. **Maintenance:** URL changes require finding all occurrences
4. **DRY Violation:** Base URL repeated 5 times

## Recommended Solution

### Create Constants at Module Level
```python
# app/strelka_ui/services/virustotal.py
import logging
import os
from io import BytesIO
import requests
import time

# VirusTotal API Configuration
VT_API_BASE_URL = os.environ.get(
    "VIRUSTOTAL_API_BASE_URL",
    "https://www.virustotal.com/api/v3"
)

VT_API_ENDPOINTS = {
    "file_info": f"{VT_API_BASE_URL}/files/{{file_hash}}",
    "file_download": f"{VT_API_BASE_URL}/files/{{file_hash}}/download",
    "zip_create": f"{VT_API_BASE_URL}/intelligence/zip_files",
    "zip_status": f"{VT_API_BASE_URL}/intelligence/zip_files/{{zip_id}}",
    "zip_download": f"{VT_API_BASE_URL}/intelligence/zip_files/{{zip_id}}/download_url",
    "widget_url": f"{VT_API_BASE_URL}/widget/url",
}

def get_virustotal_positives(api_key: str, file_hash: str) -> int:
    """Retrieves the count of malicious detections for a file from VirusTotal."""
    url = VT_API_ENDPOINTS["file_info"].format(file_hash=file_hash)
    headers = {"x-apikey": api_key}
    # ... rest of function

def download_vt_bytes(api_key: str, file_hash: str) -> BytesIO:
    """Downloads a file from VirusTotal."""
    url = VT_API_ENDPOINTS["file_download"].format(file_hash=file_hash)
    headers = {"x-apikey": api_key}
    # ... rest of function

def create_vt_zip_and_download(api_key, file_hash, password, max_attempts=3):
    """Creates password-protected ZIP file from VirusTotal."""
    create_url = VT_API_ENDPOINTS["zip_create"]
    # ...
    check_url = VT_API_ENDPOINTS["zip_status"].format(zip_id=zip_id)
    # ...
    download_url_endpoint = VT_API_ENDPOINTS["zip_download"].format(zip_id=zip_id)
    # ... rest of function
```

### Alternative: Configuration Class
```python
# app/strelka_ui/services/virustotal.py
from dataclasses import dataclass
from typing import ClassVar

@dataclass
class VirusTotalConfig:
    """VirusTotal API configuration"""
    base_url: ClassVar[str] = os.environ.get(
        "VIRUSTOTAL_API_BASE_URL",
        "https://www.virustotal.com/api/v3"
    )
    
    @classmethod
    def file_info_url(cls, file_hash: str) -> str:
        return f"{cls.base_url}/files/{file_hash}"
    
    @classmethod
    def file_download_url(cls, file_hash: str) -> str:
        return f"{cls.base_url}/files/{file_hash}/download"
    
    @classmethod
    def zip_create_url(cls) -> str:
        return f"{cls.base_url}/intelligence/zip_files"
    
    @classmethod
    def zip_status_url(cls, zip_id: str) -> str:
        return f"{cls.base_url}/intelligence/zip_files/{zip_id}"

# Usage
def get_virustotal_positives(api_key: str, file_hash: str) -> int:
    url = VirusTotalConfig.file_info_url(file_hash)
    # ...
```

## Benefits
1. **Testability:** Easy to mock entire API:
   ```python
   # In tests
   os.environ["VIRUSTOTAL_API_BASE_URL"] = "http://localhost:5000/mock-vt"
   ```

2. **Configuration:** Support enterprise endpoints:
   ```bash
   export VIRUSTOTAL_API_BASE_URL="https://virustotal.enterprise.com/api/v3"
   ```

3. **Maintenance:** Change base URL in one place

4. **Documentation:** Clear what endpoints exist

## Testing
```python
# tests/services/test_virustotal.py
import pytest
from unittest.mock import patch, Mock

@patch('strelka_ui.services.virustotal.requests.get')
def test_get_virustotal_positives(mock_get):
    """Test VT API call uses correct URL"""
    mock_response = Mock()
    mock_response.ok = True
    mock_response.json.return_value = {
        "data": {
            "attributes": {
                "last_analysis_stats": {"malicious": 5}
            }
        }
    }
    mock_get.return_value = mock_response
    
    result = get_virustotal_positives("test-key", "test-hash")
    
    # Verify URL construction
    called_url = mock_get.call_args[0][0]
    assert "files/test-hash" in called_url
    assert result == 5
```

## Environment Variables
Document in README:
```markdown
### VirusTotal Configuration

- `VIRUSTOTAL_API_KEY` - Your VirusTotal API key (required)
- `VIRUSTOTAL_API_BASE_URL` - Base URL for VT API (optional, defaults to public API)

For enterprise:
```bash
export VIRUSTOTAL_API_BASE_URL="https://virustotal.enterprise.com/api/v3"
```
```

## Labels
`refactoring`, `code-quality`, `enhancement`
