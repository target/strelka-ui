"""
Flask-RESTX API Configuration for Strelka UI

This module sets up the base API structure with namespaces and OpenAPI documentation.
Auto-generates comprehensive API documentation for external clients.
"""

from flask import Blueprint
from flask_restx import Api

# Create API blueprint
api_blueprint = Blueprint('api', __name__, url_prefix='/api')

# Configure Flask-RESTX API with comprehensive OpenAPI settings
api = Api(
    api_blueprint,
    version='v1',
    title='Strelka UI API',
    description='''https://github.com/target/strelka-ui
    ''',
    doc='/docs/',  # Swagger UI endpoint
    contact='Strelka UI Team',
    license='Apache 2.0',
    license_url='https://www.apache.org/licenses/LICENSE-2.0.html',
    validate=True,  # Enable request/response validation
    ordered=True,   # Maintain endpoint order in documentation
)

# Security schemes for OpenAPI documentation
authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'X-API-KEY',
        'description': 'API Key for authentication. Obtain via /auth/apikey endpoint.'
    }
}

# Apply security schemes to API
api.authorizations = authorizations

# Import resources to register Flask-RESTX documentation endpoints
from strelka_ui.api import resources  # pylint: disable=unused-import,import-outside-toplevel
