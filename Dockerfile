FROM node:22-slim AS ui-builder
# We are using a multi-stage build as we require node for 
# building react. 

# Copy package.json and package-lock.json into the builder.
# Copying just these files first allows us to take advantage 
# of cached Docker layers.

# Define UI build arguments.
ARG REACT_APP_SEARCH_NAME
ARG REACT_APP_SEARCH_URL

# Set the build arguments as environment variables.
ENV REACT_APP_SEARCH_NAME=$REACT_APP_SEARCH_NAME
ENV REACT_APP_SEARCH_URL=$REACT_APP_SEARCH_URL

WORKDIR /usr/src/app
COPY ./ui/package.json ./ui/yarn.lock ./

RUN yarn install

# Copy over the rest of the dependencies, source files, etc
COPY ./ui .

# Build the js app for production
RUN yarn run build

# Since we are serving it all from python, switch over to 
# a more appropriate base image.
FROM python:3.10-slim as strelka-oss-runner

RUN apt-get -y update
RUN apt-get install -y build-essential libpq-dev libmagic1

# Set Runtime Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1
ENV POETRY_VIRTUALENVS_CREATE=1

# Install Poetry globally and copy project files
RUN python3 -m pip install -U pip setuptools && \
    python3 -m pip install poetry && \
    rm -rf /root/.cache/pip

# Set the working directory and copy the project files
WORKDIR /app

# Copy only the pyproject.toml and poetry.lock files
COPY ./app/pyproject.toml ./app/poetry.lock ./

RUN poetry install --no-root

COPY ./app/strelka_ui/ ./strelka_ui/

RUN poetry install --only-root

# Copy the production UI assets into the new base image.  
COPY --from=ui-builder /usr/src/app/build/ ./strelka_ui/react-app/

# Run App
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
