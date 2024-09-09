#!/bin/bash

# Define service, region, and cloud sql instance details
SERVICE=$1
REGION=$2
CLOUDSQL_INSTANCE=$3

# Fetch Cloud SQL instances connected to the Cloud Run service
CONNECTED_INSTANCES=$(gcloud run services describe $SERVICE --region $REGION --format 'value(spec.template.metadata.annotations."run.googleapis.com/cloudsql-instances")')

# Check if the desired Cloud SQL instance is already connected
if [[ $CONNECTED_INSTANCES == *$CLOUDSQL_INSTANCE* ]]; then
    echo "The Cloud Run service $SERVICE is already connected to $CLOUDSQL_INSTANCE."
else
    echo "The Cloud Run service $SERVICE is not connected to $CLOUDSQL_INSTANCE. Connecting now..."
    gcloud run services update $SERVICE \
      --region=$REGION \
      --add-cloudsql-instances $CLOUDSQL_INSTANCE

    # Check the exit status of the command
    if [ $? -eq 0 ]; then
        echo "Successfully connected $SERVICE to $CLOUDSQL_INSTANCE."
    else
        echo "Failed to connect $SERVICE to $CLOUDSQL_INSTANCE."
        exit 1
    fi
fi
