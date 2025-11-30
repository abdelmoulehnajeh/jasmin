#!/bin/bash

# Run database migration for hero settings
echo "Running hero settings migration..."

# Check if PostgreSQL environment variables are set
if [ -z "$POSTGRES_HOST" ]; then
    echo "Warning: POSTGRES_HOST not set, using localhost"
    export POSTGRES_HOST="localhost"
fi

if [ -z "$POSTGRES_DB" ]; then
    echo "Warning: POSTGRES_DB not set, using car_rental"
    export POSTGRES_DB="car_rental"
fi

if [ -z "$POSTGRES_USER" ]; then
    echo "Warning: POSTGRES_USER not set, using postgres"
    export POSTGRES_USER="postgres"
fi

# Run the migration
PGPASSWORD=$POSTGRES_PASSWORD psql -h $POSTGRES_HOST -U $POSTGRES_USER -d $POSTGRES_DB -f database/migrations/001_hero_video.sql

if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
else
    echo "Migration failed!"
    exit 1
fi
