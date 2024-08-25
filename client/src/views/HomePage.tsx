import { useState } from "react";
import Chat from "./Chat";
import DialogPreview from "@/components/custom/DialogPreview";
import SelectWithCreate from "@/components/custom/SelectWithCreate";
import { CreateSwarmDialog } from "./CreateSwarmDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

export default function HomePage() {
  const swarmOptions = [
    { value: "swarm1", label: "Swarm 1" },
    { value: "swarm2", label: "Swarm 2" },
    { value: "swarm3", label: "Swarm 3" },
  ];
  const [selectedSwarm, setSelectedSwarm] = useState<string | null>(null);
  const [isCreateSwarmDialogOpen, setIsCreateSwarmDialogOpen] = useState(false);

  const openCreateSwarmDialog = () => {
    setIsCreateSwarmDialogOpen(true);
  };

  return (

    <div className="flex flex-col h-full">
      <header className="sticky top-0 h-15 flex items-center">
        <SelectWithCreate
          className="border-none text-lg hover:bg-muted/50"
          create={openCreateSwarmDialog}
          createMessage="Create"
          options={swarmOptions}
          onSelect={setSelectedSwarm}
          placeholder="swarmstarv2"
        />
      </header>
      <main className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full p-4">
              <Chat />
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle fadeStart fadeEnd />
          <ResizablePanel defaultSize={50} minSize={20}>
            <ResizablePanelGroup direction="vertical">
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full p-4">
                  <DialogPreview
                    previewComponent={
                      <div className="w-full h-full bg-secondary rounded-xl p-4"></div>
                    }
                    dialogContent={
                      <div className="w-full h-full rounded-xl p-4"></div>
                    }
                  />
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle fadeEnd />
              <ResizablePanel defaultSize={50} minSize={20}>
                <div className="h-full p-4">
                  <DialogPreview
                    previewComponent={
                      <div className="w-full h-full bg-secondary rounded-xl p-4"></div>
                    }
                    dialogContent={
                      <div className="w-full h-full rounded-xl p-4"></div>
                    }
                  />
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