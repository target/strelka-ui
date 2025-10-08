# Review and Restrict CORS Configuration

## Issue Type
Security

## Priority
🟡 Medium

## Description
CORS is configured with `supports_credentials=True` without specific origin restrictions, potentially allowing any origin to make authenticated requests.

## Location
`app/strelka_ui/__main__.py:48`

## Current Code
```python
CORS(app, supports_credentials=True)
```

## Security Risk
This configuration allows ANY origin to:
- Make requests with credentials (cookies, authorization headers)
- Access responses that should be restricted
- Potentially perform CSRF attacks

## Recommended Solution

### Option 1: Restrict to Specific Origins
```python
# In config.py
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:8080"
).split(",")

# In __main__.py
CORS(
    app,
    origins=current_app.config["ALLOWED_ORIGINS"],
    supports_credentials=True,
    allow_headers=["Content-Type", "Authorization", "X-API-KEY"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)
```

### Option 2: Dynamic Origin Validation
```python
from flask_cors import CORS
from urllib.parse import urlparse

def validate_origin(origin):
    """Validate origin against allowed patterns"""
    if not origin:
        return False
    
    parsed = urlparse(origin)
    allowed_domains = ["strelka-ui.example.com", "localhost"]
    
    return any(parsed.netloc.endswith(domain) for domain in allowed_domains)

CORS(
    app,
    origins=validate_origin,
    supports_credentials=True
)
```

### Option 3: Environment-Based Configuration
```python
# Development
if app.config.get("ENV") == "development":
    CORS(app, origins="*", supports_credentials=False)
else:
    # Production
    CORS(
        app,
        origins=app.config.get("ALLOWED_ORIGINS", []),
        supports_credentials=True,
        max_age=3600
    )
```

## Environment Variables
Add to `.env`:
```bash
# Comma-separated list of allowed origins
ALLOWED_ORIGINS=https://strelka-ui.company.com,https://strelka.company.com
```

## Testing
1. Test requests from allowed origins succeed
2. Test requests from disallowed origins fail
3. Verify CORS headers in responses:
   ```bash
   curl -H "Origin: https://allowed-origin.com" \
        -H "Access-Control-Request-Method: POST" \
        -X OPTIONS http://localhost:8080/api/strelka/scans
   ```
4. Check for CORS headers:
   - `Access-Control-Allow-Origin`
   - `Access-Control-Allow-Credentials`
   - `Access-Control-Allow-Methods`

## Documentation
Document CORS configuration in README:
```markdown
### CORS Configuration

For production deployments, configure allowed origins:

```bash
export ALLOWED_ORIGINS="https://your-frontend.com,https://your-app.com"
```

For development:
```bash
export ALLOWED_ORIGINS="http://localhost:3000,http://localhost:8080"
```
```

## References
- [Flask-CORS Documentation](https://flask-cors.readthedocs.io/)
- [OWASP CORS Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/CORS_Security_Cheat_Sheet.html)
- [MDN CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## Labels
`security`, `configuration`, `enhancement`
