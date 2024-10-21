// src/views/Settings/interface/interfaceSettings.tsx
import { useState } from 'react'
import CardList from '@/components/custom/CardList'
import SelectTheme from '@/components/custom/SelectTheme'
import { PanelLayoutOptions } from './PanelLayoutOptions'
import { PanelLayoutEditor } from './PanelLayoutEditor'
import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'

export function InterfaceSettings() {
  const [showPanelLayoutEditor, setShowPanelLayoutEditor] = useState(false)

  const cards = [
    {
      title: 'Theme Settings',
      headerRight: <SelectTheme />,
    },
    {
      title: 'Panel Layout Settings',
      className: 'flex-grow flex flex-col', // Allow the card to grow and be a flex container
      contentClassName: 'flex-grow overflow-y-auto', // Make content scrollable
      headerRight: showPanelLayoutEditor ? (
        <Button onClick={() => setShowPanelLayoutEditor(false)} variant='outline' size='sm'>
          <X className='mr-2 h-4 w-4' /> Close Editor
        </Button>
      ) : (
        <Button onClick={() => setShowPanelLayoutEditor(true)} variant='outline' size='sm'>
          <Plus className='mr-2 h-4 w-4' /> Create New Layout
        </Button>
      ),
      content: (
        <div className='flex flex-col flex-grow'>
          {showPanelLayoutEditor && (
            <>
              <PanelLayoutEditor />
              <hr className='my-12' />
            </>
          )}
          <PanelLayoutOptions />
        </div>
      ),
    },
  ]

  return (
    <div className='flex flex-col h-full'>
      <CardList cards={cards} className='space-y-4 flex-grow overflow-y-hidden' />
    </div>
  )
}
