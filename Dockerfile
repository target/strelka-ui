FROM node:16-slim AS UI_BUILDER
# We are using a multi-stage build as we require node for 
# building react. 

# Copy package.json and package-lock.json into the builder.
# Copying just these files first allows us to take advantage 
# of cached Docker layers.
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
RUN apt-get install -y build-essential libpq-dev

# Copy over just the Python backend app code.
WORKDIR /app
ENV ENV=production

# Set Runtime Variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PYTHONPATH /app

COPY ./app/requirements.txt .
RUN pip install -r requirements.txt

COPY ./app .

# Copy the production UI assets into the new base image.  
COPY --from=UI_BUILDER /usr/src/app/build/ ./react-app/

COPY entrypoint.sh .
RUN chmod +x entrypoint.sh
ENTRYPOINT ["./entrypoint.sh"]
