#!/bin/bash

# Check if .env file exists and source it
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
  echo "Loaded environment variables from .env file"
else
  echo "No .env file found. Make sure to set EMAIL_PASSWORD environment variable manually."
fi

# Check if EMAIL_PASSWORD is set
if [ -z "$EMAIL_PASSWORD" ]; then
  echo "ERROR: EMAIL_PASSWORD environment variable is not set."
  echo "Please set it by running: export EMAIL_PASSWORD=your_app_password"
  echo "Or create a .env file with EMAIL_PASSWORD=your_app_password"
  exit 1
fi

# Run docker-compose
docker-compose up -d

echo "Portfolio website is running at http://localhost:3000"
echo "To stop it, run: docker-compose down"
