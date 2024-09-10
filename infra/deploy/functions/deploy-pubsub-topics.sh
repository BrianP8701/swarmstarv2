TS_FILE=$1

# Extract enum values using grep and awk
# This assumes that the enum format is exactly as shown in your example
TOPICS=$(grep -Eo " = '[^']+'" $TS_FILE | awk -F"'" '{print $2}')

# Loop over each topic and create if not exists
for TOPIC_NAME in $TOPICS; do
    EXISTS=0
    ATTEMPTS=0

    # Check existence up to 3 times
    while [ $ATTEMPTS -lt 3 ]; do
        gcloud pubsub topics describe $TOPIC_NAME >/dev/null 2>&1
        if [ $? -eq 0 ]; then
            EXISTS=1
            break
        fi
        ATTEMPTS=$((ATTEMPTS + 1))
        sleep 5
    done

    if [ $EXISTS -eq 1 ]; then
        echo "Topic $TOPIC_NAME already exists."
    else
        echo "Topic $TOPIC_NAME does not exist. Creating..."
        # Use a temporary file to filter out the specific error message
        ERROR_FILE=$(mktemp)
        gcloud pubsub topics create $TOPIC_NAME 2>$ERROR_FILE
        grep -v "Resource already exists in the project" $ERROR_FILE >&2
        rm $ERROR_FILE
        if [ $? -eq 0 ]; then
            echo "Topic $TOPIC_NAME created successfully."
        else
            echo "Failed to create topic $TOPIC_NAME."
        fi
    fi
done

# Add the WebSocket topic
gcloud pubsub topics create websocket-messages || true