# Enhance README Documentation

## Issue Type
Documentation

## Priority
🟢 Low

## Description
While the README is good, it could be enhanced with additional sections to improve developer onboarding and usage.

## Missing Sections

### 1. Architecture Overview
Add a section explaining the system architecture:
```markdown
## Architecture

Strelka UI is composed of three main components:

```
┌─────────────────┐
│   React UI      │ (Port 8080)
│  (TypeScript)   │
└────────┬────────┘
         │
         │ REST API
         ▼
┌─────────────────┐
│  Flask Backend  │ (Port 8080)
│    (Python)     │
└────────┬────────┘
         │
    ┌────┴─────┬──────────────┐
    ▼          ▼              ▼
┌────────┐ ┌────────┐  ┌──────────┐
│ Strelka│ │  DB    │  │   S3     │
│(gRPC)  │ │(Postgres)│ │(Optional)│
└────────┘ └────────┘  └──────────┘
```

### Components:
- **React UI**: TypeScript/React frontend with Ant Design
- **Flask Backend**: Python REST API handling authentication, file submission, and data retrieval
- **PostgreSQL**: Stores submission metadata, users, and scan results
- **Strelka**: External file scanning service (gRPC)
- **S3** (Optional): File storage for resubmission feature
```

### 2. Development Setup
```markdown
## Development Setup

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose
- Access to Strelka instance

### Backend Development
```bash
# Install dependencies
cd app
poetry install

# Set up database
export DATABASE_URL="postgresql://user:pass@localhost:5432/strelka_ui"
poetry run flask db upgrade

# Run development server
poetry run python -m strelka_ui
```

### Frontend Development
```bash
# Install dependencies
cd ui
yarn install

# Start development server (with hot reload)
yarn dev

# Build for production
yarn build
```

### Running Tests
```bash
# Backend tests
cd app
poetry run pytest

# Frontend tests
cd ui
yarn test
```
```

### 3. API Examples
Expand the API examples section:
```markdown
## API Examples

### Authentication
```python
import requests

# Login
response = requests.post(
    "http://localhost:8080/api/auth/login",
    json={"username": "user", "password": "pass"}
)
session_cookie = response.cookies

# Get API Key
response = requests.get(
    "http://localhost:8080/api/auth/apikey",
    cookies=session_cookie
)
api_key = response.json()["api_key"]
```

### File Submission
```python
# Submit file
with open("sample.exe", "rb") as f:
    files = {"file": f}
    headers = {"X-API-KEY": api_key}
    response = requests.post(
        "http://localhost:8080/api/strelka/scans/upload",
        files=files,
        headers=headers,
        data={"description": "Suspicious file"}
    )
submission_id = response.json()["file_id"]
```

### Retrieve Scan Results
```python
# Get scan by ID
response = requests.get(
    f"http://localhost:8080/api/strelka/scans/{submission_id}",
    headers={"X-API-KEY": api_key}
)
scan_data = response.json()
```

### Search Submissions
```python
# Search for files
response = requests.get(
    "http://localhost:8080/api/strelka/scans",
    headers={"X-API-KEY": api_key},
    params={
        "search": "malware",
        "page": 1,
        "per_page": 10,
        "sortField": "submitted_at",
        "sortOrder": "descend"
    }
)
results = response.json()
```
```

### 4. Troubleshooting
```markdown
## Troubleshooting

### Common Issues

#### Database Connection Errors
```
Error: could not connect to server: Connection refused
```
**Solution:** Ensure PostgreSQL is running and credentials are correct.

#### Strelka Connection Errors
```
Error: Strelka is not reachable
```
**Solution:** 
1. Verify STRELKA_HOST and STRELKA_PORT are correct
2. Test connection: `telnet $STRELKA_HOST $STRELKA_PORT`
3. Check if Strelka service is running

#### LDAP Authentication Failing
```
Error: login failure for user: failed to find username
```
**Solution:**
1. Verify LDAP_URL is accessible
2. Check LDAP_SEARCH_BASE is correct
3. Test LDAP connection with ldapsearch

#### File Upload Size Limit
```
Error: File too large
```
**Solution:** Default limit is 150MB. Files larger than this cannot be uploaded.

### Debug Mode
Enable debug logging:
```bash
export FLASK_ENV=development
export FLASK_DEBUG=1
python -m strelka_ui
```

### Health Checks
```bash
# Check database
curl http://localhost:8080/api/strelka/status/database

# Check Strelka
curl http://localhost:8080/api/strelka/status/strelka
```
```

### 5. Configuration Reference
```markdown
## Configuration Reference

### Required Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| STRELKA_HOST | Strelka hostname | `0.0.0.0` |
| STRELKA_PORT | Strelka port | `57314` |
| DATABASE_HOST | PostgreSQL host | `localhost` |
| DATABASE_PASSWORD | Database password | `secretpass` |
| SECRET_KEY | Flask secret key | `generate-with-secrets.token_hex()` |

### Optional Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| VIRUSTOTAL_API_KEY | - | VT API key for enrichment |
| LDAP_URL | - | LDAP server URL |
| S3_BUCKET_NAME | - | S3 bucket for file storage |
| ENABLE_FILE_RESUBMISSION | `false` | Enable S3-based resubmission |

See `app/example.env` for complete list.
```

### 6. Deployment Guide
```markdown
## Deployment

### Docker Production Deployment
```bash
# Build images
docker-compose build

# Run with production config
docker-compose -f docker-compose.prod.yml up -d
```

### Security Considerations
- [ ] Use HTTPS/TLS in production
- [ ] Rotate SECRET_KEY regularly
- [ ] Enable LDAP for authentication
- [ ] Configure CORS for specific origins
- [ ] Enable rate limiting
- [ ] Regular security audits
- [ ] Keep dependencies updated

### Monitoring
- Application logs: Check Docker logs or application output
- Database health: Monitor PostgreSQL metrics
- Strelka connectivity: Monitor status endpoints
```

## Implementation
1. Create new markdown sections
2. Add architecture diagram (use ASCII or mermaid)
3. Expand API examples with more endpoints
4. Add troubleshooting section
5. Create deployment guide
6. Add security checklist

## Benefits
- Faster onboarding for new developers
- Reduced support burden
- Better understanding of architecture
- Easier troubleshooting

## Labels
`documentation`, `enhancement`, `good first issue`
