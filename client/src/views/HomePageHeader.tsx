import { Settings } from 'lucide-react'
import SelectWithCreate from '../components/custom/SelectWithCreate'
import TooltipDialogButton from '../components/custom/TooltipDialog'
import { SettingsDialog } from './Settings/Settings'

export default function HomePageHeader({
  swarms,
  selectedSwarmId,
  setSelectedSwarmId,
  openCreateSwarmDialog,
}: {
  swarms: Array<{ value: string; label: string }>
  selectedSwarmId: string | undefined
  setSelectedSwarmId: (id: string) => void
  openCreateSwarmDialog: () => void
}) {
  return (
    <header className='sticky top-0 flex items-center justify-between px-4'>
      <SelectWithCreate
        className='border-none text-lg hover:bg-muted/50 shadow-none'
        create={openCreateSwarmDialog}
        createMessage='Create'
        options={swarms}
        onSelect={setSelectedSwarmId}
        placeholder='swarmstarv2'
        selectedValue={selectedSwarmId}
        emptyMessage='No swarms found'
      />
      <div className='flex items-center space-x-2'>
        <TooltipDialogButton tooltipText='Settings' ariaLabel='Settings' dialogContent={<SettingsDialog />}>
          <Settings className='size-5' strokeWidth={1} />
        </TooltipDialogButton>
      </div>
    </header>
  )
}
