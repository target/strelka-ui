# Implement API Rate Limiting

## Issue Type
Security / Enhancement

## Priority
🟡 Medium

## Description
The application has no rate limiting on API endpoints, making it vulnerable to brute force attacks and denial of service (DoS).

## Attack Scenarios
1. **Brute Force Login:** Attacker tries many passwords on login endpoint
2. **API Abuse:** Malicious user floods file submission endpoint
3. **DoS Attack:** High request volume overwhelms server resources

## Recommended Solution

Use Flask-Limiter:

### Installation
```bash
poetry add flask-limiter
```

### Implementation
```python
# In __main__.py
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = create_app()

# Configure rate limiter
limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri="redis://localhost:6379",  # Or use memory:// for simpler setup
    strategy="fixed-window",
)

# Apply to specific endpoints
@app.route("/api/auth/login", methods=["POST"])
@limiter.limit("5 per minute")  # Stricter for auth
def login():
    # ... existing code ...

@app.route("/api/strelka/scans/upload", methods=["POST"])
@limiter.limit("10 per minute")  # Limit file uploads
def upload():
    # ... existing code ...
```

### Recommended Limits

| Endpoint Type | Rate Limit | Reasoning |
|--------------|------------|-----------|
| Login | 5/minute, 20/hour | Prevent brute force |
| File Upload | 10/minute, 100/hour | Balance usability/abuse |
| API Key Generation | 3/hour | Rarely needed |
| Read Operations | 100/minute | More permissive |
| Search | 30/minute | Moderate CPU usage |

### Configuration Options
```python
# Environment-based configuration
RATELIMIT_ENABLED = os.getenv("RATELIMIT_ENABLED", "true").lower() == "true"
RATELIMIT_STORAGE_URL = os.getenv("RATELIMIT_STORAGE_URL", "memory://")

if RATELIMIT_ENABLED:
    limiter = Limiter(
        app=app,
        key_func=get_remote_address,
        storage_uri=RATELIMIT_STORAGE_URL
    )
```

### Custom Error Responses
```python
@app.errorhandler(429)
def ratelimit_handler(e):
    return jsonify({
        "error": "Rate limit exceeded",
        "message": "Too many requests. Please try again later."
    }), 429
```

### Advanced: User-Based Limits
```python
def get_user_or_ip():
    """Rate limit by user if authenticated, else by IP"""
    if 'user_id' in session:
        return f"user:{session['user_id']}"
    return get_remote_address()

limiter = Limiter(
    app=app,
    key_func=get_user_or_ip,
    ...
)
```

## Testing
1. Test normal usage stays within limits
2. Verify rate limit headers in response:
   ```
   X-RateLimit-Limit: 50
   X-RateLimit-Remaining: 49
   X-RateLimit-Reset: 1640000000
   ```
3. Test 429 response when limit exceeded
4. Verify limits reset after time window

## Alternative: Redis Backend
For production, use Redis for distributed rate limiting:
```python
RATELIMIT_STORAGE_URL = "redis://redis:6379/0"
```

Add to docker-compose.yml:
```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

## Monitoring
Log rate limit violations:
```python
@limiter.request_filter
def log_rate_limit():
    if limiter.check():
        return False
    logging.warning(
        f"Rate limit exceeded: {get_remote_address()} on {request.endpoint}"
    )
    return True
```

## References
- [Flask-Limiter Documentation](https://flask-limiter.readthedocs.io/)
- [OWASP API Security - Rate Limiting](https://owasp.org/API-Security/editions/2023/en/0xa4-unrestricted-resource-consumption/)

## Labels
`security`, `enhancement`
