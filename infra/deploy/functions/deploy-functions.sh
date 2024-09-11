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

# Add this function to check if a handler should be deployed as a cloud function
should_deploy_as_cloud_function() {
    local handler_name=$1
    case $handler_name in
        WebSocketHandler)
            return 1  # Don't deploy as a cloud function
            ;;
        *)
            return 0  # Deploy as a cloud function
            ;;
    esac
}

# Modify the deployment loop
for handler in ${HANDLERS[@]}; do
    if should_deploy_as_cloud_function $handler; then
        deploy_function $handler
    else
        echo "Skipping deployment of $handler as a cloud function"
    fi
done
