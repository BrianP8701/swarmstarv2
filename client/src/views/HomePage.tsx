// src/views/HomePage.tsx
import { useState, useEffect } from 'react'
import { useSwarmData } from '../hooks/useSwarmData'
import { CreateSwarmDialog } from './Dialogs/CreateSwarmDialog'
import { useFetchUser } from '../hooks/fetchUser'
import { Loader2Icon } from 'lucide-react'
import HomePageHeader from './HomePageHeader'
import { PanelLayout } from '@/components/custom/PanelLayout'
import { PanelNode, PanelNodeCreateInput } from '@/graphql/generated/graphql'
import { renderPanelContent } from '../hooks/renderPanelContent'

export default function HomePage() {
  const { user, loading } = useFetchUser()
  const appState = useSwarmData(undefined, user)
  const { selectedSwarmId, setSelectedSwarmId } = appState

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

  // Get the first panel layout from the user's panel layouts
  const panelLayout = user?.panelLayouts?.[0]

  if (!panelLayout) {
    // Handle the case when there is no panel layout
    return <div>No panel layout available</div>
  }

  const renderContent = (node: PanelNodeCreateInput | PanelNode) => {
    return renderPanelContent(node.content, appState)
  }

  return (
    <div className='flex flex-col h-screen p-2'>
      <HomePageHeader
        swarms={swarms.map(swarm => ({ value: swarm.id, label: swarm.title ?? 'Untitled Swarm' }))}
        selectedSwarmId={selectedSwarmId}
        setSelectedSwarmId={setSelectedSwarmId}
        openCreateSwarmDialog={openCreateSwarmDialog}
      />
      <main className='flex-1'>
        <PanelLayout
          nodes={panelLayout.panelNodes ?? []}
          rootNodeId={panelLayout.rootPanelNodeId ?? ''}
          renderContent={renderContent}
          showBorders={false}
        />
      </main>
      <CreateSwarmDialog open={isCreateSwarmDialogOpen} onOpenChange={setIsCreateSwarmDialogOpen} />
    </div>
  )
}
