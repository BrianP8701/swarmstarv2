import { useEffect, useState } from "react";
import Chat from "@/views/Chat/Chat";
import DialogPreview from "@/components/custom/DialogPreview";
import SelectWithCreate from "@/components/custom/SelectWithCreate";
import { CreateSwarmDialog } from "./CreateSwarmDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { useFetchSwarmLazyQuery, FetchSwarmQuery } from "../graphql/generated/graphql";
import { TreeVisualizer } from "../components/custom/tree/TreeVisualizer";
import { useFetchUser } from "../hooks/fetchUser";

export default function HomePage() {
  const { user } = useFetchUser();
  const [fetchSwarm, { data: swarmData }] = useFetchSwarmLazyQuery();

  const [selectedSwarmId, setSelectedSwarmId] = useState<string | undefined>(undefined);
  const [swarm, setSwarm] = useState<FetchSwarmQuery | undefined>(undefined);
  const [isCreateSwarmDialogOpen, setIsCreateSwarmDialogOpen] = useState(false);

  const openCreateSwarmDialog = () => {
    setIsCreateSwarmDialogOpen(true);
  };

  useEffect(() => {
    if (selectedSwarmId) {
      fetchSwarm({ variables: { id: selectedSwarmId } });
    }
  }, [selectedSwarmId, fetchSwarm]);

  useEffect(() => {
    if (swarmData) {
      setSwarm(swarmData ?? undefined);
    }
  }, [swarmData]);

  const swarms = user?.swarms ?? [];
  const actionMetadataNodes = swarm?.fetchSwarm?.data?.actionMetadataNodes ?? [];

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 h-15 flex items-center">
        <SelectWithCreate
          className="border-none text-lg hover:bg-muted/50"
          create={openCreateSwarmDialog}
          createMessage="Create"
          options={swarms.map(swarm => ({ value: swarm.id, label: swarm.title ?? 'Untitled Swarm' })) ?? []}
          onSelect={setSelectedSwarmId}
          placeholder="swarmstarv2"
          selectedValue={selectedSwarmId}
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
                      <TreeVisualizer nodes={actionMetadataNodes} />
                    }
                    dialogContent={
                      <TreeVisualizer nodes={actionMetadataNodes} />
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
