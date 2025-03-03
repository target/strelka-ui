# Strelka UI


### Quick Start with Docker Compose

You can use Docker Compose to run the entire application locally. 
```sh
# from the root of the repository
docker compose up --build
```

This will start the full ui/backend service and a Postgres database.
The app will now be running at http://localhost:8080 using a fresh docker build.


### Developing the UI Locally

With docker compose running, you can start another version the UI locally for development by running:
```sh
# from the root of the repository
cd ui

# install dependencies
yarn install

# make a copy of the .env.example file
cp .env.example .env.local

# edit .env.local to add any missing information
open .env

# finally, start the UI in development mode
yarn dev
```

Visit http://localhost:5173. This UI will be running against the backend service running in Docker compose. Any changes you make to the UI will be trigger a hot reload.


### Additional Scripts
- `yarn build`: Builds the application for production.
- `yarn lint`: Lints the codebase.
- `yarn lint --fix`: Found some lint errors? Run this command to try to fix them automatically.
