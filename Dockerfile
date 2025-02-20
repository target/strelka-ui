FROM node:16-slim AS UI_BUILDER
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
FROM python:3.9-slim

RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install -y build-essential libpq-dev libmagic1

# Set Runtime Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install Poetry globally and copy project files
RUN python3 -m pip install -U pip setuptools && \
    python3 -m pip install poetry && \
    rm -rf /root/.cache/pip

# Set the working directory and copy the project files
WORKDIR /app

# Use Poetry to install the project dependencies globally
# This step is after the COPY step because it is more likely to change,
# and therefore should not be included in earlier layers that can be cached.

COPY ./app/pyproject.toml ./app/poetry.lock ./

RUN poetry config virtualenvs.create false && \
    poetry install --no-root && \
    rm -rf /root/.cache/pypoetry

# Copy the other project files
COPY ./app .

# Use Poetry to install the local package strelka-ui
RUN poetry install --only-root && \
    rm -rf /root/.cache/pypoetry

# Copy the production UI assets into the new base image.
COPY --from=UI_BUILDER /usr/src/app/build/ ./strelka_ui/react-app/

# Run App
COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
