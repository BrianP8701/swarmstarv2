// client/src/views/Settings/Settings.tsx
import { DialogContent } from '@/components/ui/dialog'
import { useState } from 'react'
import SlideSidebar from '../../components/custom/SlideSidebar'
import { Button } from '@/components/ui/button'
import { PanelRightClose, PanelRightOpen } from 'lucide-react'
import { InterfaceSettings } from './InterfaceSettings/InterfaceSettings'
import { ScrollArea } from '@/components/ui/scroll-area'

export enum SettingsTabs {
  INTERFACE = 'Interface',
}

export function SettingsDialog() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<string | null>(SettingsTabs.INTERFACE)
  const options = [{ value: SettingsTabs.INTERFACE, label: 'Interface' }]

  const renderTabContent = () => {
    switch (selectedTab) {
      case SettingsTabs.INTERFACE:
        return <InterfaceSettings />
      default:
        return <div>Select a tab to view content</div>
    }
  }

  return (
    <DialogContent className='rounded-2xl bg-secondary w-[70vw] min-w-[600px] h-[80vh]'>
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='absolute top-2 left-2 px-1 py-2 z-30'
        variant='ghost'
      >
        {isSidebarOpen ? <PanelRightClose size={20} strokeWidth={1} /> : <PanelRightOpen size={20} strokeWidth={1} />}
      </Button>
      <div
        className={`z-20 absolute top-0 left-0 h-full transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? 'w-40' : 'w-0 pointer-events-none'
        }`}
      >
        <SlideSidebar options={options} selectedOptionId={selectedTab} setSelectedOptionId={setSelectedTab} />
      </div>
      <div className='flex-grow overflow-hidden relative'>
        <ScrollArea className='h-full masked-scroll'>
          <div className='p-4'>{renderTabContent()}</div>
        </ScrollArea>
      </div>
    </DialogContent>
  )
}
