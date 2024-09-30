import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function SettingsDialog() {
  return (
    <DialogContent className='border-secondary border-2 rounded-2xl bg-background'>
      <DialogHeader>
        <DialogTitle>Settings</DialogTitle>
      </DialogHeader>
    </DialogContent>
  )
}
