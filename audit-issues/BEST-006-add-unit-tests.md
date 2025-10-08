# Add Comprehensive Unit Test Coverage

## Issue Type
Testing / Technical Debt

## Priority
🔴 High

## Description
The codebase currently has minimal test coverage. No Python unit tests were found, and only one TypeScript test file exists (`ui/src/tests/colors.test.ts`).

## Current State
- **Python Tests:** ❌ 0 files
- **TypeScript Tests:** ⚠️ 1 file (colors.test.ts)
- **Target Coverage:** >80%

## Why This Matters
- Risk of regressions when making changes
- Difficult to refactor code safely
- No confidence in code correctness
- Harder to onboard new contributors
- Production bugs are more likely

## Recommended Approach

### Phase 1: Setup Test Infrastructure
1. Add pytest and dependencies to `pyproject.toml`:
```toml
[tool.poetry.dev-dependencies]
pytest = "^7.4.0"
pytest-cov = "^4.1.0"
pytest-flask = "^1.2.0"
pytest-mock = "^3.11.1"
```

2. Create `pytest.ini` configuration:
```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

### Phase 2: Priority Test Areas

#### Critical Paths (Week 1)
1. **Authentication** (`tests/test_auth.py`)
   - Login functionality
   - API key generation and validation
   - Session management
   - LDAP authentication (with mocking)

2. **File Submission** (`tests/test_file_submission.py`)
   - File upload and validation
   - Strelka integration
   - Database storage
   - S3 storage (if enabled)

3. **Security Functions** (`tests/test_security.py`)
   - Input validation
   - File size checking
   - Filename sanitization

#### Service Layer (Week 2)
4. **Insights Service** (`tests/services/test_insights.py`)
5. **S3 Service** (`tests/services/test_s3.py`)
6. **VirusTotal Service** (`tests/services/test_virustotal.py`)
7. **File Operations** (`tests/services/test_files.py`)

#### Models (Week 3)
8. **Database Models** (`tests/test_models.py`)
9. **Helper Functions** (`tests/test_model_helpers.py`)

### Example Test Structure

```python
# tests/test_auth.py
import pytest
from flask import session
from strelka_ui.models import User, ApiKey
from strelka_ui.services.auth import authenticate_user, check_credentials

@pytest.fixture
def app():
    from strelka_ui.__main__ import create_app
    app = create_app()
    app.config['TESTING'] = True
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def db_session(app):
    from strelka_ui.database import db
    with app.app_context():
        db.create_all()
        yield db
        db.session.remove()
        db.drop_all()

class TestAuthentication:
    def test_login_success(self, client, db_session):
        """Test successful login"""
        response = client.post('/api/auth/login', json={
            'username': 'testuser',
            'password': 'testpass'
        })
        assert response.status_code == 200
        assert 'user_name' in response.json
    
    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        response = client.post('/api/auth/login', json={
            'username': 'wrong',
            'password': 'wrong'
        })
        assert response.status_code == 401
    
    def test_api_key_generation(self, client, db_session):
        """Test API key generation"""
        # Setup: Create user and login
        # ... 
        response = client.get('/api/auth/apikey')
        assert response.status_code == 201
        assert 'api_key' in response.json
        assert len(response.json['api_key']) >= 32
```

### Frontend Testing
Expand Vitest test coverage:
```typescript
// ui/src/services/api.test.ts
import { describe, it, expect, vi } from 'vitest'
import { login, logout, fetchScanById } from './api'

describe('API Service', () => {
  it('should login successfully', async () => {
    // Mock axios
    // Test login
  })
  
  it('should handle login errors', async () => {
    // Test error cases
  })
})
```

### Phase 3: Integration Tests
Create integration tests that test full workflows:
- File upload → Strelka scan → Database storage
- VirusTotal augmentation flow
- File resubmission flow

### Phase 4: CI/CD Integration
Add to GitHub Actions:
```yaml
- name: Run Python Tests
  run: |
    poetry install
    poetry run pytest --cov=strelka_ui --cov-report=xml
    
- name: Run TypeScript Tests
  run: |
    cd ui
    yarn test --coverage
```

## Success Criteria
- [ ] >80% code coverage for Python backend
- [ ] >70% code coverage for TypeScript frontend
- [ ] All critical paths have tests
- [ ] Tests run in CI/CD pipeline
- [ ] Coverage reports generated

## Effort Estimate
- Initial setup: 1-2 days
- Critical tests: 1 week
- Comprehensive coverage: 3-4 weeks
- Maintenance: Ongoing

## Labels
`testing`, `technical-debt`, `enhancement`
