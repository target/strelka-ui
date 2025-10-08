# Improve Exception Handling Specificity

## Issue Type
Code Quality / Security

## Priority
🟡 Medium

## Description
The codebase has multiple instances of broad exception handling that catches all exceptions without proper logging or specific error types.

## Locations
- `app/strelka_ui/blueprints/strelka.py:94,400`
- `app/strelka_ui/models.py:143,169`
- `app/strelka_ui/services/insights.py` (multiple locations)
- `app/strelka_ui/services/virustotal.py:40,165`

## Current Behavior
```python
# Example 1 - Generic catch-all
try:
    if get_frontend_status():
        return jsonify({"message": "Strelka is reachable"}), 200
except Exception:
    return jsonify({"message": "Strelka is not reachable"}), 500

# Example 2 - Minimal logging
try:
    # ... complex logic ...
except Exception as e:
    return jsonify({"error": "...", "details": str(e)}), 500
```

## Problems
1. Hides unexpected errors that should be surfaced
2. Makes debugging difficult
3. May expose internal error details to users
4. Catches errors that should crash the application (e.g., MemoryError)

## Recommended Solution

### Pattern 1: Catch Specific Exceptions
```python
try:
    if get_frontend_status():
        return jsonify({"message": "Strelka is reachable"}), 200
except (socket.error, ConnectionError, TimeoutError) as e:
    logging.error(f"Failed to connect to Strelka: {e}", exc_info=True)
    return jsonify({"message": "Strelka is not reachable"}), 500
```

### Pattern 2: Log Then Re-raise
```python
try:
    insights = get_insights(scanned_file)
except (KeyError, TypeError) as e:
    logging.warning(f"Could not process insights: {e}")
    insights = []  # Use safe default
except Exception as e:
    logging.error(f"Unexpected error in insights: {e}", exc_info=True)
    raise  # Re-raise unexpected errors
```

### Pattern 3: Don't Expose Internal Details
```python
try:
    # ... operation ...
except SpecificError as e:
    logging.error(f"Operation failed: {e}", exc_info=True)
    # Return generic message to user
    return jsonify({"error": "Operation failed"}), 500
```

## Files to Review
1. `app/strelka_ui/blueprints/strelka.py`
2. `app/strelka_ui/models.py`
3. `app/strelka_ui/services/insights.py`
4. `app/strelka_ui/services/virustotal.py`
5. `app/strelka_ui/services/files.py`

## Testing
1. Test error paths explicitly
2. Verify appropriate logging
3. Ensure user-facing errors are generic
4. Confirm critical errors are not silently caught

## Labels
`code-quality`, `security`, `refactoring`
