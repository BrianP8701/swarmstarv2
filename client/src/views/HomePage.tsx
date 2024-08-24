import { useState } from "react";
import Chat from "./Chat";
import DialogSection from "@/components/custom/DialogSection";
import SelectWithCreate from "@/components/custom/SelectWithCreate";
import { CreateSwarmDialog } from "./CreateSwarmDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function HomePage() {
  const [selectedSwarm, setSelectedSwarm] = useState<string | null>(null);
  const [isCreateSwarmDialogOpen, setIsCreateSwarmDialogOpen] = useState(false);

  const openCreateSwarmDialog = () => {
    setIsCreateSwarmDialogOpen(true);
  };

  return (

    <div className="flex flex-col h-full">
      <header className="sticky top-0 h-15 flex items-center z-20">
        <SelectWithCreate
          className="border-none text-lg hover:bg-muted/50"
          create={openCreateSwarmDialog}
          createMessage="Create"
          options={[]}
          onSelect={setSelectedSwarm}
          placeholder="No Swarm Selected"
        />
      </header>
      <main className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full p-4">
              <div className="relative flex h-full flex-col rounded-xl bg-muted/50">
                <Chat />
              </div>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="flex-1 p-4">
                  <DialogSection selectedSwarm={selectedSwarm} />
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="flex-1 p-4">
                  <DialogSection selectedSwarm={selectedSwarm} />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>
      <CreateSwarmDialog
        open={isCreateSwarmDialogOpen}
        onOpenChange={setIsCreateSwarmDialogOpen}
      />
    </div >
  );
}