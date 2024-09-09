#!/bin/bash

# Define service, region, trigger topic details
SERVICE=$1
REGION=$2
SOURCE=$3
TRIGGER_TOPIC=$4

echo "Deploying pubsub function $SERVICE to $REGION..."
gcloud functions deploy $SERVICE \
  --gen2 \
  --runtime=nodejs18 \
  --region=$REGION \
  --source=$SOURCE \
  --entry-point=$SERVICE \
  --service-account=$SERVICE_ACCOUNT \
  --run-service-account=$SERVICE_ACCOUNT \
  --allow-unauthenticated \
  --trigger-topic=$TRIGGER_TOPIC \
  --set-env-vars NODE_ENV=production