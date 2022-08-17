<h1 align="center">
  <img src="./misc/assets/strelkaui_banner.png" alt="Strelka Banner" />
</h1>

The Strelka Web UI is a browser / API based file submission frontend for the [Strelka Enterprise File Scanner](https://github.com/target/strelka). This application allows users to easily submit files to a Strelka cluster and review historical response results.

<div align="center">
  <img src="./misc/assets/strelkaui_results.png" alt="Strelka UI Results Page" />
  <h5>Strelka UI Results Page</h5>
</div>

## Features
The file submission UI provides the following features:
* Submit files to a Strelka cluster and examine responses from your browser.
* Store and review previous submission results and activity in either a local or remote database.
* Support for [LDAP Authentication](https://ldap.com/)

## Prerequisites
- Accessible Strelka instance (See: [Strelka Quickstart](https://github.com/target/strelka#quickstart))
- docker
- docker-compose
- python 3.6+

## Quick Start
By default, the Strelka UI is configured to use a minimal "quickstart" deployment that allows users to test the system. This deployment will target a local Strelka instance and start a local database. Users will be able to access this system with whatever username / password they want. For additional information on targeting a remote Strelka instance, database, or using LDAP for authentication, see the [Additional Setup](#quick-start) section:

#### Step 0: Ensure a Strelka Cluster is Ready
```
Start or ensure Strelka cluster is ready and accessible.
See https://github.com/target/strelka for more information.
```

#### Step 1: Build and Start Strelka UI (Docker)
```
# Terminal 1
# From the ./strelka-ui directory
$ docker-compose -f docker-compose.yaml up
```

#### Step 2: (Required Only for First Launch): Initialize Database
```
# Terminal 2
# Setup a Virtual Python Environment
# From the ./strelka-ui directory

$ python3 -m venv env
$ source env/bin/activate
$ pip3 install -r app/requirements.txt

# Initialize database 
$ python3 app/manage.py db init
$ python3 app/manage.py db migrate
$ python3 app/manage.py db upgrade
```

#### Step 3: Access Strelka UI
```
1) Open A Browser
2) Navigate to 0.0.0.0:8080
3) Login with:
    - Username: strelka
    - Password: strelka
```    

## Additional Steps
This section provides details on how to target a remote Strelka instance, a remote database for storage, and an LDAP server for authentication for more secure use. To enable these, you can use environment variables to override the defaults.

#### Environment Variable Configuration
Backend configuration is provided through environment variables and can be set statically in `config.py`.

Running locally, the precedence of config is: `System environment -> .env -> config.py`.
Running in Docker, the precedence of config is: `Docker environment -> System environment -> config.py`.

Please reference `./app/example.env` for environment variable setup.

#### Environment Variable Options
```
# Strelka connection information (OPTIONAL / HAS DEFAULTS).
STRELKA_HOST=<Strelka Hostname
STRELKA_PORT=<Strelka Port>
STRELKA_CERT=<Path to Certificate for Strelka (If needed)

# LDAP URL and credentials for search-bind auth (OPTIONAL).
LDAP_URL=<URL to LDAP Server>
CA_CERT_PATH=<Path To CA Certificates For LDAP>

# Folder where the build react app is served from  (OPTIONAL / HAS DEFAULTS).
# Requires the front end to be built (i.e. from /ui, run `npm run build`)
STATIC_ASSET_FOLDER=<Build Folder for UI>

# Folder where the alembic migrations live  (OPTIONAL / HAS DEFAULTS).
MIGRATION_DIRECTORY=<SQLAlchemy Migrations Directory>

# Database configuration (REQUIRED / HAS DEFAULTS FOR LOCAL COMPOSE CLUSTER ONLY). 
DATABASE_USERNAME=<Database User Name>
DATABASE_PASSWORD=<Database User Password>
DATABASE_HOST=<Database Hostname>
DATABASE_PORT=<Database Port>
DATABASE_DBNAME=<Name of Database>
```

## API
The Strelka UI also provides API routes for user script based access. Please reference the below routes for details:

#### Authentication routes 
- [base url]/api/auth/login (POST)
- [base url]/api/auth/logout (GET)

#### Strelka routes
- [base url]/api/strelka/scans/stats (GET)
- [base url]/api/strelka/scans/upload (POST, form-encoded)
- [base url]/api/strelka/scans?page=?&per_page=? (GET)
- [base url]/api/strelka/scans/[scan id] (GET)

## Database
The database uses [https://www.sqlalchemy.org/](SQLAlchemy) as an ORM. [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/) is used to provide db migrations though Alembic. A helper script file, `manage.py`, is provided to assist with common database tasks. 

If you are creating a new database, or modifying the current one, you must perform the following steps:

Generate a new migration from model changes:
- python manage.py db migrate 

Update the database using the current database configuration
- python manage.py db upgrade

## Application Details
The backend application is predominantly comprised of the following technologies:
- [https://flask.palletsprojects.com/en/1.1.x/](Flask) 
- [https://www.sqlalchemy.org/](SQLAlchemy) 
- [https://www.postgresql.org/](PostgreSQL)

The frontend UI is a React JS application created using React served from Flask. The UI uses the `Antd` library and `Antd ProComponents`, and routing is handled by React Router.
- [create-react-app](https://github.com/facebook/create-react-app)
- [Ant Financial UI](https://ant.design/)
- [Antd ProComponents](https://procomponents.ant.design/)
- [React Router](https://reactrouter.com/web/)

<div align="center">
  <img style="border:1px solid black;" src="./misc/assets/strelkaui_dashboard.png" alt="Strelka UI Dashboard Page" />
  <h5>Strelka UI Dashboard Page</h5>
</div>

<div align="center">
  <img style="border:1px solid black;" src="./misc/assets/target_banner.png" alt="Target Banner" />
</div>
