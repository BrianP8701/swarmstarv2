import { useEffect, useState } from "react";
import Chat from "@/views/Chat/Chat";
import DialogPreview from "@/components/custom/DialogPreview";
import SelectWithCreate from "@/components/custom/SelectWithCreate";
import { CreateSwarmDialog } from "./Dialogs/CreateSwarmDialog";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  useFetchSwarmLazyQuery,
  SwarmWithDataFragment
} from "../graphql/generated/graphql";
import { TreeVisualizer } from "../components/custom/tree/TreeVisualizer";
import { useFetchUser } from "../hooks/fetchUser";
import { Loader2Icon } from "lucide-react";

export default function HomePage() {
  const { user, loading } = useFetchUser();
  const [fetchSwarm, { data: swarmData }] = useFetchSwarmLazyQuery();

  const [selectedSwarmId, setSelectedSwarmId] = useState<string | undefined>(undefined);
  const [swarm, setSwarm] = useState<SwarmWithDataFragment | undefined>(undefined);
  const [isCreateSwarmDialogOpen, setIsCreateSwarmDialogOpen] = useState(false);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const openCreateSwarmDialog = () => {
    setIsCreateSwarmDialogOpen(true);
  };

  useEffect(() => {
    if (selectedSwarmId) {
      fetchSwarm({ variables: { swarmId: selectedSwarmId } });
    }
  }, [selectedSwarmId, fetchSwarm]);

  useEffect(() => {
    if (swarmData?.fetchSwarm) {
      setSwarm({
        ...swarmData.fetchSwarm,
        data: swarmData.fetchSwarm.data ?? undefined
      });
    }
  }, [swarmData]);

  useEffect(() => {
    if (user && user.swarms && user.swarms.length > 0 && !selectedSwarmId) {
      setSelectedSwarmId(user.swarms[0].id);
    }
  }, [user, selectedSwarmId]);

  useEffect(() => {
    if (swarm && swarm.data?.chats && swarm.data.chats.length > 0 && !selectedChatId) {
      setSelectedChatId(swarm.data.chats[0].id);
    }
  }, [swarm, selectedChatId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2Icon className="animate-spin" size={48} />
      </div>
    );
  }

  const swarms = user?.swarms ?? [];
  const actionMetadataNodes = swarm?.data?.actionMetadataNodes ?? [];

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
          emptyMessage="No swarms found"
        />
      </header>
      <main className="flex-1">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={50} minSize={20}>
            <div className="h-full p-4">
              <DialogPreview
                previewComponent={
                  <Chat swarm={swarm} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
                }
                dialogContent={
                  <Chat swarm={swarm} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
                }
                dialogProps={{ swarm, selectedChatId, setSelectedChatId }}
              />
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
                      <div className="w-full h-full">
                        <TreeVisualizer nodes={actionMetadataNodes} />
                      </div>
                    }
                    dialogContent={
                      <div className="w-full h-full">
                        <TreeVisualizer nodes={actionMetadataNodes} />
                      </div>
                    }
                  />
                </div>
              </ResizablePanel>

            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main >
      <CreateSwarmDialog
        open={isCreateSwarmDialogOpen}
        onOpenChange={setIsCreateSwarmDialogOpen}
      />
    </div >
  );
}
