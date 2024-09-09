#!/bin/bash

# Define service, region
SERVICE=$1
REGION=$2
SOURCE=$3

echo "Deploying http function $SERVICE to $REGION..."
gcloud functions deploy $SERVICE \
  --gen2 \
  --runtime=nodejs18 \
  --region=$REGION \
  --source=$SOURCE \
  --entry-point=$SERVICE \
  --service-account=$SERVICE_ACCOUNT \
  --run-service-account=$SERVICE_ACCOUNT \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production