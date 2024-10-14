// src/views/renderPanelContent.tsx
import React from 'react'
import { PanelContentEnum } from '@/graphql/generated/graphql'
import Chat from '@/views/Chat/Chat'
import { GraphVisualizer } from '../components/custom/graph/GraphVisualizer'
import DialogPreview from '@/components/custom/DialogPreview'
import { AppState } from '../hooks/useSwarmData'

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
            previewComponent={<GraphVisualizer nodes={agentGraph?.nodes ?? []} edges={agentGraph?.edges ?? []} />}
            dialogContent={<GraphVisualizer nodes={agentGraph?.nodes ?? []} edges={agentGraph?.edges ?? []} />}
          />
        </div>
      )
    case PanelContentEnum.ActionGraph:
      return (
        <div className='h-full p-4'>
          <DialogPreview
            previewComponent={<GraphVisualizer nodes={actionGraph?.nodes ?? []} edges={actionGraph?.edges ?? []} />}
            dialogContent={<GraphVisualizer nodes={actionGraph?.nodes ?? []} edges={actionGraph?.edges ?? []} />}
          />
        </div>
      )
    // Add other cases as needed
    default:
      return <div>No content</div>
  }
}
