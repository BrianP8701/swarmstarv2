// src/views/Settings/interface/PanelLayoutOptions.tsx
import { PanelLayout } from '@/components/custom/PanelLayout'
import { PanelContentEnum, SplitDirectionEnum, PanelNodeCreateInput } from '@/graphql/generated/graphql'
import { prettifyString } from '@/utils/strings'

const sampleLayouts: PanelNodeCreateInput[] = [
  {
    id: '1',
    content: PanelContentEnum.Empty,
    split: SplitDirectionEnum.Horizontal,
    firstChild: { id: '2', content: PanelContentEnum.Chat },
    secondChild: { id: '3', content: PanelContentEnum.InformationGraph },
  },
  {
    id: '4',
    content: PanelContentEnum.Empty,
    split: SplitDirectionEnum.Vertical,
    firstChild: { id: '5', content: PanelContentEnum.AgentGraph },
    secondChild: { id: '6', content: PanelContentEnum.ToolGraph },
  },
  // Add more sample layouts as needed
]

export function PanelLayoutOptions() {
  const renderContent = (node: PanelNodeCreateInput) => {
    return (
      <div className='flex items-center justify-center h-full w-full'>
        <span className='text-xs'>{prettifyString(node.content ?? '')}</span>
      </div>
    )
  }

  return (
    <div className='flex flex-col'>
      <div className='grid grid-cols-3 gap-4'>
        {sampleLayouts.map(layout => (
          <div key={layout.id} className='h-24 border rounded-2xl overflow-hidden'>
            <PanelLayout node={layout} renderContent={renderContent} className='h-full w-full' />
          </div>
        ))}
      </div>
    </div>
  )
}
