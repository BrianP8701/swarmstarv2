import { useState, useEffect } from 'react'
import { useSwarmData } from '../hooks/useSwarmData'
import Chat from '@/views/Chat/Chat'
import DialogPreview from '@/components/custom/DialogPreview'
import SelectWithCreate from '@/components/custom/SelectWithCreate'
import { CreateSwarmDialog } from './Dialogs/CreateSwarmDialog'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { GraphVisualizer } from '../components/custom/graph/GraphVisualizer'
import { useFetchUser } from '../hooks/fetchUser'
import { Loader2Icon } from 'lucide-react'

export default function HomePage() {
  const { user, loading } = useFetchUser()
  const { swarm, actionGraph, agentGraph, selectedChatId, setSelectedChatId, selectedSwarmId, setSelectedSwarmId } =
    useSwarmData(undefined, user)

  const [isCreateSwarmDialogOpen, setIsCreateSwarmDialogOpen] = useState(false)

  const openCreateSwarmDialog = () => {
    setIsCreateSwarmDialogOpen(true)
  }

  useEffect(() => {
    if (user && user.swarms && user.swarms.length > 0 && !selectedSwarmId) {
      setSelectedSwarmId(user.swarms[0].id)
    }
  }, [user, selectedSwarmId, setSelectedSwarmId])

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader2Icon className='animate-spin' size={48} />
      </div>
    )
  }

  const swarms = user?.swarms ?? []

  return (
    <div className='flex flex-col h-full'>
      <header className='sticky top-0 h-15 flex items-center'>
        <SelectWithCreate
          className='border-none text-lg hover:bg-muted/50'
          create={openCreateSwarmDialog}
          createMessage='Create'
          options={swarms.map(swarm => ({ value: swarm.id, label: swarm.title ?? 'Untitled Swarm' })) ?? []}
          onSelect={setSelectedSwarmId}
          placeholder='swarmstarv2'
          selectedValue={selectedSwarmId}
          emptyMessage='No swarms found'
        />
      </header>
      <main className='flex-1'>
        <ResizablePanelGroup direction='horizontal'>
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className='h-full p-4'>
              <DialogPreview
                previewComponent={
                  <Chat swarm={swarm} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
                }
                dialogContent={
                  <Chat swarm={swarm} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
                }
                dialogProps={{ swarm, selectedChatId, setSelectedChatId }}
              />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle fadeStart fadeEnd />
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResizablePanelGroup direction='vertical'>
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className='h-full p-4'>
                  <DialogPreview
                    previewComponent={
                      <div className='w-full h-full'>
                        <GraphVisualizer nodes={agentGraph?.nodes ?? []} edges={agentGraph?.edges ?? []} />
                      </div>
                    }
                    dialogContent={
                      <div className='w-full h-full'>
                        <GraphVisualizer nodes={agentGraph?.nodes ?? []} edges={agentGraph?.edges ?? []} />
                      </div>
                    }
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle fadeEnd />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className='h-full p-4'>
                  <DialogPreview
                    previewComponent={
                      <div className='w-full h-full'>
                        <GraphVisualizer nodes={actionGraph?.nodes ?? []} edges={actionGraph?.edges ?? []} />
                      </div>
                    }
                    dialogContent={
                      <div className='w-full h-full'>
                        <GraphVisualizer nodes={actionGraph?.nodes ?? []} edges={actionGraph?.edges ?? []} />
                      </div>
                    }
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <CreateSwarmDialog open={isCreateSwarmDialogOpen} onOpenChange={setIsCreateSwarmDialogOpen} />
    </div>
  )
}
