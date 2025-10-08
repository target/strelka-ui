# Add Security Headers to Flask Application

## Issue Type
Security Enhancement

## Priority
🔴 High

## Description
The Flask application does not set standard security headers, making it vulnerable to common web attacks including XSS, clickjacking, and MIME-sniffing attacks.

## Current Behavior
No security headers are set in the Flask application.

## Expected Behavior
The application should set the following security headers on all responses:
- `X-Frame-Options: DENY` or `SAMEORIGIN` (clickjacking protection)
- `X-Content-Type-Options: nosniff` (MIME-sniffing protection)
- `Content-Security-Policy` (XSS protection)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains` (HTTPS enforcement)
- `X-XSS-Protection: 1; mode=block` (legacy XSS protection)
- `Referrer-Policy: strict-origin-when-cross-origin`

## Location
`app/strelka_ui/__main__.py`

## Recommended Solution

### Option 1: Use Flask-Talisman (Recommended)
```python
from flask_talisman import Talisman

app = create_app()

# Configure Talisman with appropriate CSP
csp = {
    'default-src': "'self'",
    'script-src': ["'self'", "'unsafe-inline'"],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'https:'],
}

Talisman(app, 
    force_https=True,
    strict_transport_security=True,
    content_security_policy=csp
)
```

### Option 2: Manual Headers
```python
@app.after_request
def add_security_headers(response):
    response.headers['X-Frame-Options'] = 'SAMEORIGIN'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response
```

## Labels
`security`, `enhancement`, `good first issue`
