# Use Timezone-Aware Datetime Objects

## Issue Type
Bug / Security

## Priority
🔴 High

## Description
The codebase uses timezone-naive datetime objects (`datetime.now()` and `datetime.utcnow()`) in 13+ locations, which can lead to bugs when comparing times across different timezones and deployment environments.

## Current Behavior
Mixed use of `datetime.now()` and `datetime.utcnow()` without timezone awareness:
- `app/strelka_ui/services/auth.py:45` - `datetime.now()`
- `app/strelka_ui/services/s3.py:74,87,125` - `datetime.utcnow()`
- `app/strelka_ui/blueprints/strelka.py` - Multiple uses in date filtering
- `app/strelka_ui/blueprints/auth.py:42,94` - Date comparisons

## Expected Behavior
All datetime objects should be timezone-aware using UTC timezone.

## Impact
- Incorrect time comparisons when server timezone != UTC
- API key expiration bugs
- File expiration calculation errors
- Submission time filtering errors

## Recommended Solution

Replace all occurrences:
```python
# Bad
datetime.now()
datetime.utcnow()

# Good
from datetime import datetime, timezone
datetime.now(timezone.utc)
```

Example fixes:
```python
# In auth.py
if db_key and datetime.now(timezone.utc) <= db_key.expiration:

# In s3.py
return datetime.now(timezone.utc) + timedelta(days=retention_days)

# In strelka.py
FileSubmission.submitted_at >= datetime.now(timezone.utc) - timedelta(30)
```

## Testing
1. Run existing tests with different timezone environments
2. Verify API key expiration works correctly
3. Test file expiration logic
4. Verify submission filtering by date

## References
- [Python datetime best practices](https://docs.python.org/3/library/datetime.html#aware-and-naive-objects)
- [PEP 615 – Support for the IANA Time Zone Database](https://peps.python.org/pep-0615/)

## Labels
`bug`, `security`, `technical-debt`
