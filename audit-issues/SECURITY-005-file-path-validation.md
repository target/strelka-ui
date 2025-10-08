# Add Path Traversal Validation for File Operations

## Issue Type
Security

## Priority
🟡 Medium

## Description
File operations in `services/files.py` don't validate filenames against path traversal attacks (e.g., `../../etc/passwd`).

## Location
`app/strelka_ui/services/files.py`

## Current Behavior
Functions like `decrypt_file()` and `prepare_decrypted_file()` use filenames from user input without validation.

## Attack Vector
An attacker could submit a malicious archive with filenames containing path traversal sequences:
- `../../etc/passwd`
- `../../../root/.ssh/id_rsa`
- `C:\Windows\System32\config\SAM` (Windows)

## Recommended Solution

Add filename sanitization function:
```python
import os
import re
from pathlib import Path

def sanitize_filename(filename: str, max_length: int = 255) -> str:
    """
    Sanitize filename to prevent path traversal and other attacks.
    
    Args:
        filename: Original filename
        max_length: Maximum allowed filename length
        
    Returns:
        Sanitized filename
        
    Raises:
        ValueError: If filename is invalid
    """
    if not filename:
        raise ValueError("Filename cannot be empty")
    
    # Get just the basename (no path components)
    filename = os.path.basename(filename)
    
    # Remove any remaining path separators
    filename = filename.replace('/', '_').replace('\\', '_')
    
    # Remove null bytes
    filename = filename.replace('\x00', '')
    
    # Remove or replace dangerous characters
    # Allow alphanumeric, dots, dashes, underscores
    filename = re.sub(r'[^a-zA-Z0-9._-]', '_', filename)
    
    # Prevent hidden files (starting with .)
    if filename.startswith('.'):
        filename = '_' + filename[1:]
    
    # Prevent multiple dots (e.g., ../)
    filename = re.sub(r'\.{2,}', '.', filename)
    
    # Enforce length limit
    if len(filename) > max_length:
        name, ext = os.path.splitext(filename)
        filename = name[:max_length-len(ext)] + ext
    
    return filename
```

Use in extraction functions:
```python
def decrypt_file(file_storage: FileStorage, password: str):
    # ... existing code ...
    
    # Sanitize all extracted filenames
    sanitized_files = []
    for path in extracted_files:
        safe_name = sanitize_filename(os.path.basename(path))
        safe_path = os.path.join(os.path.dirname(temp_file.name), safe_name)
        os.rename(path, safe_path)
        sanitized_files.append(safe_path)
    
    return True, [prepare_decrypted_file(path) for path in sanitized_files]
```

## Additional Security Measures
1. Use `os.path.abspath()` and verify extracted files stay within temp directory
2. Set maximum extraction size limit
3. Limit number of files that can be extracted
4. Validate file MIME types after extraction

## Testing
Create test archive with malicious filenames:
```python
def test_path_traversal_protection():
    malicious_names = [
        "../../etc/passwd",
        "../../../root/.ssh/id_rsa",
        "..\\..\\Windows\\System32\\config\\SAM",
        ".hidden",
        "file\x00.txt",
    ]
    for name in malicious_names:
        assert not Path(sanitize_filename(name)).is_absolute()
        assert '..' not in sanitize_filename(name)
```

## References
- [OWASP Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)
- [CWE-22: Path Traversal](https://cwe.mitre.org/data/definitions/22.html)

## Labels
`security`, `enhancement`
