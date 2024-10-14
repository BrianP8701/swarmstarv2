// src/views/Settings/interface/PanelLayoutOptions.tsx
import { PanelLayout } from '@/components/custom/PanelLayout'
import { PanelNodeCreateInput, useSelectPanelLayoutMutation } from '@/graphql/generated/graphql'
import { useFetchUser } from '../../../hooks/fetchUser'
import { prettifyString } from '@/utils/strings'

export function PanelLayoutOptions() {
  const { user } = useFetchUser()
  const panelLayouts = user?.panelLayouts
  const [selectPanelLayout] = useSelectPanelLayoutMutation()

  const renderContent = (node: PanelNodeCreateInput) => {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <span className='text-[10px] text-center'>{prettifyString(node.content ?? '')}</span>
      </div>
    )
  }

  const handleSelectLayout = async (panelLayoutId: string) => {
    try {
      await selectPanelLayout({ variables: { panelLayoutId } })
    } catch (error) {
      console.error('Error selecting panel layout:', error)
    }
  }

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-3 gap-4'>
        {panelLayouts?.map((layout, index) => (
          <button
            key={index}
            onClick={() => handleSelectLayout(layout.id)}
            className='h-32 border rounded-2xl overflow-hidden hover:bg-accent focus:outline-none transition duration-200'
          >
            <PanelLayout
              nodes={layout.panelNodes ?? []}
              rootNodeId={layout.rootPanelNodeId ?? ''}
              renderContent={renderContent}
              className='h-full w-full'
            />
          </button>
        ))}
      </div>
    </div>
  )
}
