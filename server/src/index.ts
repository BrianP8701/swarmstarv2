/*
 * This file is required to be in the server/src folder instead of server/src/functions
 * because cloud functions expect the entrypoint to index.js in root of dist
 */
import * as functionsFramework from '@google-cloud/functions-framework'
import 'reflect-metadata'
import { ClerkEventHttp } from './functions/http/ClerkEvent'
import { PubSubTopic } from './functions/pubsub/PubSubTopic'
import { AlertHandler } from './functions/pubsub/handler/AlertHandler'
import { OperationHandler } from './functions/pubsub/handler/OperationHandler'

functionsFramework.http('clerk-event-http', ClerkEventHttp)

functionsFramework.cloudEvent(PubSubTopic.AlertHandler, AlertHandler.eventHandler)
functionsFramework.cloudEvent(PubSubTopic.OperationHandler, OperationHandler.eventHandler)
