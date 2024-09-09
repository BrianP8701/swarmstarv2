import { AlertHandler } from './handler/AlertHandler'
import { OperationHandler } from './handler/OperationHandler'
import { WebSocketHandler } from './handler/WebSocketHandler'
import { SecretService, Environment } from '../../services/SecretService'
import { container } from '../../utils/di/container'
import { PubSubTopic } from './PubSubTopic'

type Handler = { registerLocalHandler: () => void }

function getHandlerForTopic(topic: PubSubTopic): Handler | null {
  switch (topic) {
    case PubSubTopic.AlertHandler:
      return container.get(AlertHandler)
    case PubSubTopic.OperationHandler:
      return container.get(OperationHandler)
    case PubSubTopic.WebSocketHandler:
      return container.get(WebSocketHandler)
    default:
      return null
  }
}

export function initializePubSubHandlers() {
  const secretService = container.get(SecretService)
  if (secretService.getEnvVars().MODE === Environment.LOCAL) {
    // Initialize PubSub handlers
    Object.values(PubSubTopic).forEach(topic => {
      const handler = getHandlerForTopic(topic)
      if (handler) {
        handler.registerLocalHandler()
      }
    })
  }
}
