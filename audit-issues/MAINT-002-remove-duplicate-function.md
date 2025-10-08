# Remove Duplicate get_request_time Function

## Issue Type
Code Quality / Refactoring

## Priority
🟢 Low

## Description
The `get_request_time()` function is defined in two places with identical implementation, violating DRY principle.

## Locations
1. `app/strelka_ui/blueprints/strelka.py:412` (27 lines)
2. `app/strelka_ui/models.py:191` (17 lines)

## Current Code
Both locations have:
```python
def get_request_time(response: dict) -> str:
    """
    Get the time of the request from the Strelka response.

    Args:
        response (dict): The response from Strelka.

    Returns:
        str: The time of the request if it exists, otherwise an empty string.
    """
    return (
        str(datetime.datetime.fromtimestamp(response["request"]["time"]))
        if "request" in response and "time" in response["request"]
        else ""
    )
```

## Recommended Solution

### Step 1: Keep Definition in models.py
The function is already in `models.py` and imported in that module's __init__ or used internally. Keep it there as it's a model utility function.

### Step 2: Remove from strelka.py
Delete lines 412-426 in `app/strelka_ui/blueprints/strelka.py`

### Step 3: Import Where Needed
If `get_request_time` is used in `strelka.py`, import it:
```python
from strelka_ui.models import FileSubmission, User, get_request_id, get_request_time
```

### Step 4: Verify No Other Uses
Search for other duplicates:
```bash
grep -rn "def get_request_time" app/
```

## Testing
1. Verify import works correctly
2. Run all tests to ensure no breakage
3. Check that Strelka file submission still works

## Additional Cleanup
Consider creating a `strelka_ui/utils/` module for shared utility functions:
```python
# strelka_ui/utils/strelka_helpers.py
import datetime
from typing import Optional

def get_request_id(response: dict) -> str:
    """Extract request ID from Strelka response"""
    return response.get("request", {}).get("id", "")

def get_request_time(response: dict) -> str:
    """Extract request time from Strelka response"""
    request_data = response.get("request", {})
    if "time" in request_data:
        return str(datetime.datetime.fromtimestamp(request_data["time"]))
    return ""

def get_request_time_datetime(response: dict) -> Optional[datetime.datetime]:
    """Extract request time as datetime object"""
    request_data = response.get("request", {})
    if "time" in request_data:
        return datetime.datetime.fromtimestamp(request_data["time"])
    return None
```

## Labels
`refactoring`, `code-quality`, `good first issue`
