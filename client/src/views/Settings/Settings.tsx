import { DialogContent } from '@/components/ui/dialog'
import { useState } from 'react';
import SlideSidebar from '../../components/custom/SlideSidebar';
import { Button } from '@/components/ui/button';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { PanelLayoutEditor } from './PanelLayoutEditor';

export enum SettingsTabs {
  PANEL_LAYOUT = 'Panel Layout',
  THEME = 'Theme',
}

export function SettingsDialog() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<string | null>(SettingsTabs.PANEL_LAYOUT)
  const options = [
    { value: SettingsTabs.PANEL_LAYOUT, label: 'Panel Layout' },
    { value: SettingsTabs.THEME, label: 'Theme' },
  ];

  const renderTabContent = () => {
    switch (selectedTab) {
      case SettingsTabs.PANEL_LAYOUT:
        return <PanelLayoutEditor />;
      case SettingsTabs.THEME:
        return <div>Theme Content</div>;
      default:
        return <div>Select a tab to view content</div>;
    }
  };

  return (
    <DialogContent className='rounded-2xl bg-secondary w-[50vw] max-w-[50vw] h-[70vh] max-h-[70vh]'>
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='absolute top-2 left-2 px-1 py-2 z-30'
        variant='ghost'
      >
        {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
      </Button>
      <div
        className={`z-20 absolute top-0 left-0 h-full transition-all duration-300 ${isSidebarOpen ? 'w-40' : 'w-0'} overflow-hidden`}
      >
        <SlideSidebar options={options} selectedOptionId={selectedTab} setSelectedOptionId={setSelectedTab} />
      </div>
      <div className='main-content p-4'>
        {renderTabContent()}
      </div>
    </DialogContent>
  )
}
