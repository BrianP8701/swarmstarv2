// src/views/renderPanelContent.tsx
import React from 'react'
import { PanelContentEnum, ActionNode } from '@/graphql/generated/graphql'
import Chat from '@/views/Chat/Chat'
import { GraphVisualizer, BaseNode } from '../components/custom/graph/GraphVisualizer'
import DialogPreview from '@/components/custom/DialogPreview'
import { AppState } from '../hooks/useSwarmData'

// Define ActionNodeType enum if it's not already defined in your types
enum ActionNodeType {
  // Add your action node types here
  TYPE1 = 'TYPE1',
  TYPE2 = 'TYPE2',
  // ...
}

type ActionNodeWithCustomType = ActionNode & BaseNode<ActionNodeType>

export function renderPanelContent(content: PanelContentEnum | null | undefined, props: AppState): React.ReactNode {
  const { swarm, actionGraph, agentGraph, selectedChatId, setSelectedChatId } = props

  switch (content) {
    case PanelContentEnum.Chat:
      return (
        <div className='h-full p-4'>
          <DialogPreview
            previewComponent={
              <Chat swarm={swarm} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
            }
            dialogContent={<Chat swarm={swarm} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />}
            dialogProps={{ swarm, selectedChatId, setSelectedChatId }}
          />
        </div>
      )
    case PanelContentEnum.AgentGraph:
      return (
        <div className='h-full p-4'>
          <DialogPreview
            previewComponent={
              <GraphVisualizer
                nodes={agentGraph?.nodes ?? []}
                edges={agentGraph?.edges ?? []}
                hierarchical={false}
              />
            }
            dialogContent={
              <GraphVisualizer
                nodes={agentGraph?.nodes ?? []}
                edges={agentGraph?.edges ?? []}
                hierarchical={false}
              />
            }
          />
        </div>
      )
    case PanelContentEnum.ActionGraph:
      const actionNodes = (actionGraph?.nodes ?? []) as ActionNodeWithCustomType[]
      const rootNodeId = actionNodes.length > 0 ? actionNodes[0].id : undefined

      const renderActionTooltip = (node: ActionNodeWithCustomType) => (
        <div className="p-2 max-w-md">
          <h3 className="font-bold">{node.title}</h3>
          <p>{node.description}</p>
          <p>Type: {node.type}</p>
        </div>
      )

      return (
        <div className='h-full p-4'>
          <DialogPreview
            previewComponent={
              <GraphVisualizer<ActionNodeWithCustomType, ActionNodeType>
                nodes={actionNodes}
                edges={actionGraph?.edges ?? []}
                edgeLength={100}
                hierarchical={true}
                rootNodeId={rootNodeId}
                renderTooltip={renderActionTooltip}
              />
            }
            dialogContent={
              <GraphVisualizer<ActionNodeWithCustomType, ActionNodeType>
                nodes={actionNodes}
                edges={actionGraph?.edges ?? []}
                edgeLength={100}
                hierarchical={true}
                rootNodeId={rootNodeId}
                renderTooltip={renderActionTooltip}
              />
            }
          />
        </div>
      )
    // Add other cases as needed
    default:
      return <div>No content</div>
  }
}
