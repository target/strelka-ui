<h1 align="center">
  <img src="./misc/assets/strelkaui_banner.png" alt="Strelka Banner" />
</h1>

<div align="center">

[Releases][release]&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Pull Requests][pr]&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;[Issues][issues]

[![GitHub release][img-version-badge]][repo] [![Build Status][img-actions-badge]][actions-ci] [![Pull Requests][img-pr-badge]][pr] [![Slack][img-slack-badge]][slack] [![License][img-license-badge]][license]

</div>

The Strelka Web UI is a browser and API-based file submission frontend for the [Strelka Enterprise File Scanner](https://github.com/target/strelka). It allows users to submit files to a Strelka cluster and review historical response results easily. The Strelka Web UI supports LDAP authentication and API access, providing a secure and flexible way to interact with the Strelka scanner. This document provides details on how to set up and use the Strelka Web UI, as well as its features and related projects.

<div align="center">
  <img src="./misc/assets/strelkaui_results.gif" alt="Strelka UI Results Page" />
  <h5>Strelka UI Results Page</h5>
</div>

## Features

The file submission UI provides the following features:

- Submit files to a Strelka cluster and examine responses from your browser.
- Store and review previous submission results and activity in either a local or remote database.
- Support for [LDAP Authentication](https://ldap.com/)
- API support

## Prerequisites

- Accessible Strelka instance (See: [Strelka Quickstart](https://github.com/target/strelka#quickstart))
- Docker
- Docker-compose
- Python 3.9+

## Quick Start

By default, the Strelka UI is configured to use a minimal "quickstart" deployment that allows users to test the system. This deployment will target a local Strelka instance and start a local database. Users will be able to access this system with whatever username / password they want. For additional information on targeting a remote Strelka instance, database, or using LDAP for authentication, see the [Additional Setup](#quick-start) section:

#### Step 1: Ensure a Strelka Cluster is Ready

```
Start or ensure Strelka cluster is ready and accessible.
See https://github.com/target/strelka for more information.
```

#### Step 2: Build and Start Strelka UI (Docker)

```
# Terminal 1
# From the ./strelka-ui directory
$ docker-compose -f docker-compose.yml up
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

Backend configuration is provided through environment variables and can be set statically in `./app/config/config.py`.

Running locally, the precedence of config is: `System environment -> .env -> ./app/config/config.py`.
Running in Docker, the precedence of config is: `Docker environment -> System environment -> ./app/config/config.py`.

Please reference `./app/example.env` for environment variable setup.

#### Environment Variable Options

The following detail the configuration items in `./app/config/config.py`.

| Field Name                              | Value                                                                   | Required |
|-----------------------------------------|-------------------------------------------------------------------------| -------- |
| STRELKA_HOST                            | Strelka hostname (e.g., `0.0.0.0`)                                      | Yes      |
| STRELKA_PORT                            | Strelka port number (e.g., `57314`)                                     | Yes      |
| STRELKA_CERT                            | Path to certificate for Strelka, if needed (e.g., `/path/to/cert.pem`)  | No       |
| CA_CERT_PATH                            | Path to CA certificates for LDAP, if needed (e.g., `/path/to/ca_certs`) | No       |
| VIRUSTOTAL_API_KEY                      | API Key for VirusTotal Hash Lookup                                      | Yes      |
| VIRUSTOTAL_API_LIMIT                    | Limit how many files should be scanned by VirusTotal (Default: `30`)    | Yes      |
| LDAP_URL                                | URL to LDAP server (e.g., `ldaps://ldap.example.com:636`)               | No       |
| LDAP_SEARCH_BASE                        | Search base for LDAP queries (e.g., `DC=example,DC=com`)                | No       |
| LDAP_USERNAME_ORGANIZATION              | Username organization for LDAP queries (e.g., `org//`)                  | No       |
| LDAP_ATTRIBUTE_ACCOUNT_NAME_FIELD       | LDAP attribute for account name (e.g., `sAMAccountName`)                | No       |
| LDAP_ATTRIBUTE_FIRST_NAME_FIELD         | LDAP attribute for first name (e.g., `givenName`)                       | No       |
| LDAP_ATTRIBUTE_LAST_NAME_FIELD          | LDAP attribute for last name (e.g., `sn`)                               | No       |
| LDAP_ATTRIBUTE_MEMBER_OF_FIELD          | LDAP attribute for member of (e.g., `memberOf`)                         | No       |
| LDAP_ATTRIBUTE_MEMBER_REQUIREMENT_FIELD | LDAP attribute for member requirement (e.g., `AD Attribute`)            | No       |
| STATIC_ASSET_FOLDER                     | Build folder for UI (e.g., `build`)                                     | Yes      |
| MIGRATION_DIRECTORY                     | SQLAlchemy migrations directory (e.g., `./migrations`)                  | Yes      |
| DATABASE_USERNAME                       | Database username (e.g., `admin`)                                       | Yes      |
| DATABASE_PASSWORD                       | Database password (e.g., `password123`)                                 | Yes      |
| DATABASE_HOST                           | Database hostname (e.g., `db.example.com`)                              | Yes      |
| DATABASE_PORT                           | Database port number (e.g., `5432`)                                     | Yes      |
| DATABASE_DBNAME                         | Name of the database (e.g., `mydb`)                                     | Yes      |
| API_KEY_EXPIRATION                      | Duration in days of API key expiration (e.g., `30`)                     | Yes      |

##### External Hotlink Support

You can also set a reference in the UI submission table to allow users to quickly pivot to an external site based on the `request.id`. By modifying `./ui/src/config.js` and following the `SEARCH_URL` example in the following table, you can provide users with a link to an external site (e.g., SIEM / logger). Ensure your link has the string `<REPLACE>` in it and the UI will replace that string with the relevant file's request ID.

Supported modification fields in `./ui/src/config.js`:
| Field Name | Value | Example |
|--------------|------------------------------------------------------------------------------------------------|----------|
| SEARCH_URL | Search URL for the external application | Ex: https://search.com/?q=request.id=<REPLACE> |
| SEARCH_NAME | Search name for the external application | Ex: Splunk |
| DEFAULT_EXCLUDED_SUBMITTERS | Default users to be exluded from Submission table view. Useful for hiding automations by default. | Ex: SearchBot |

#### Providing CA certificates
If you need to provide a custom CA bundle due to your network environment, you can do so by setting the `REQUESTS_CA_BUNDLE` environment variable.

When running via docker compose, the `certs` directory at the root of the project will be mounted to `/certs` in the container. Place your CA bundle in that directory and set the `REQUESTS_CA_BUNDLE` environment variable to point to it.

## API

The Strelka UI also provides API routes for user script based access. Please reference the below routes for details:

#### Authentication routes

- [base url]/api/auth/login (POST)
- [base url]/api/auth/logout (GET)

#### Strelka routes

- [base url]/api/strelka/scans/stats (GET)
- [base url]/api/strelka/scans/upload (POST, form-encoded)
- [base url]/api/strelka/scans?page=?&per_page=? (GET)
- [base url]/api/strelka/scans/[scan id](GET)

#### Example

Examples for how to authenticate to the Strelka UI API, gather Scan statistics, and Submit a file using Python `requests` can be found in `./misc/examples/api_examples.py`

## Database

The database uses [https://www.sqlalchemy.org/](SQLAlchemy) as an ORM. [Flask-Migrate](https://flask-migrate.readthedocs.io/en/latest/) is used to provide db migrations though Alembic. A helper script file, `manage.py`, is provided to assist with common database tasks.

If you are creating a new database, or modifying the current one, you must perform the following steps - although upon starting the cluster, these commands will be executed for you:

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

## Related Projects

- [Strelka](https://github.com/target/strelka)

## Licensing

Strelka UI and its associated code is released under the terms of the [Apache 2.0 License](https://github.com/target/strelka-ui/blob/master/LICENSE).

<div align="center">
  <img style="border:1px solid black;" src="./misc/assets/target_banner.png" alt="Target Banner" />
</div>

<!--
Links
-->

[release]: https://github.com/target/strelka-ui/releases/latest "Strelka UI Latest Release"
[issues]: https://github.com/target/strelka-ui/issues "Strelka UI Issues"
[pull-requests]: https://github.com/target/strelka-ui/pulls "Strelka UI Pull Requests"
[repo]: https://github.com/target/strelka-ui "Strelka UI Repository"
[slack]: https://join.slack.com/t/cfc-open-source/shared_invite/zt-e54crchh-a6x4iDy18D5lVwFKQoEeEQ "Slack (external link)"
[actions-ci]: https://github.com/target/strelka-ui/actions/workflows/build_strelkaui_daily.yml "Github Actions"
[pr]: https://github.com/target/strelka-ui/pulls "Strelka UI Pull Requests"
[license]: https://github.com/target/strelka-ui/blob/master/LICENSE "Strelka UI License File"
[docker]: https://www.docker.com/ "Docker (external link)"

<!--
Badges
-->

[img-version-badge]: https://img.shields.io/github/release/target/strelka-ui.svg?style=for-the-badge
[img-actions-badge]: https://img.shields.io/github/actions/workflow/status/target/strelka-ui/build_strelkaui_daily.yml?branch=main&style=for-the-badge
[img-slack-badge]: https://img.shields.io/badge/slack-join-red.svg?style=for-the-badge&logo=slack
[img-pr-badge]: https://img.shields.io/badge/PRs-welcome-orange.svg?style=for-the-badge&logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIGlkPSJzdmcyIiB3aWR0aD0iNjQ1IiBoZWlnaHQ9IjU4NSIgdmVyc2lvbj0iMS4wIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPiA8ZyBpZD0ibGF5ZXIxIj4gIDxwYXRoIGlkPSJwYXRoMjQxNyIgZD0ibTI5Ny4zIDU1MC44N2MtMTMuNzc1LTE1LjQzNi00OC4xNzEtNDUuNTMtNzYuNDM1LTY2Ljg3NC04My43NDQtNjMuMjQyLTk1LjE0Mi03Mi4zOTQtMTI5LjE0LTEwMy43LTYyLjY4NS01Ny43Mi04OS4zMDYtMTE1LjcxLTg5LjIxNC0xOTQuMzQgMC4wNDQ1MTItMzguMzg0IDIuNjYwOC01My4xNzIgMTMuNDEtNzUuNzk3IDE4LjIzNy0zOC4zODYgNDUuMS02Ni45MDkgNzkuNDQ1LTg0LjM1NSAyNC4zMjUtMTIuMzU2IDM2LjMyMy0xNy44NDUgNzYuOTQ0LTE4LjA3IDQyLjQ5My0wLjIzNDgzIDUxLjQzOSA0LjcxOTcgNzYuNDM1IDE4LjQ1MiAzMC40MjUgMTYuNzE0IDYxLjc0IDUyLjQzNiA2OC4yMTMgNzcuODExbDMuOTk4MSAxNS42NzIgOS44NTk2LTIxLjU4NWM1NS43MTYtMTIxLjk3IDIzMy42LTEyMC4xNSAyOTUuNSAzLjAzMTYgMTkuNjM4IDM5LjA3NiAyMS43OTQgMTIyLjUxIDQuMzgwMSAxNjkuNTEtMjIuNzE1IDYxLjMwOS02NS4zOCAxMDguMDUtMTY0LjAxIDE3OS42OC02NC42ODEgNDYuOTc0LTEzNy44OCAxMTguMDUtMTQyLjk4IDEyOC4wMy01LjkxNTUgMTEuNTg4LTAuMjgyMTYgMS44MTU5LTI2LjQwOC0yNy40NjF6IiBmaWxsPSIjZGQ1MDRmIi8%2BIDwvZz48L3N2Zz4%3D
[img-license-badge]: https://img.shields.io/badge/license-apache-ff69b4.svg?style=for-the-badge&logo=apache
[img-docker-badge]: https://img.shields.io/badge/Supports-Docker-yellow.svg?style=for-the-badge&logo=docker
