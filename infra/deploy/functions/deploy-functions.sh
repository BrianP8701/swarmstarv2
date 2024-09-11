# Usage: ./deploy-functions.sh <path-to-functions>

REGION="us-central1"
CLOUDSQL_INSTANCE="swarmstar:us-central1:swarmstarv2"
DIR="$(dirname "$0")"
SOURCE=$1

# -------------- WEBHOOK -------------- #
sh "$DIR/deploy-functions-webhook.sh" clerk-event-http $REGION $SOURCE &
wait

# -------------- PUBSUB --------------- #
sh "$DIR/deploy-functions-pubsub.sh" operation-handler $REGION $SOURCE operation-handler &
wait

# -------------- CONNECT CLOUDSQL -------------- #
sh "$DIR/deploy-functions-connect-cloudsql.sh" clerk-event-http $REGION $CLOUDSQL_INSTANCE &
sh "$DIR/deploy-functions-connect-cloudsql.sh" operation-handler $REGION $CLOUDSQL_INSTANCE &
wait
