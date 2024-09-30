import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SelectWithCreate from "@/components/custom/SelectWithCreate"
import { useState } from "react"
import { useFetchUser } from "../../hooks/fetchUser"
import { CreateInformationDialog } from "./CreateInformationGraphDialog"
import { CreateSwarmRequest, useCreateSwarmMutation } from "@/graphql/generated/graphql"
import ButtonWithTooltipWhenDisabled from "@/components/custom/ButtonWithTooltipWhenDisabled"

const initialCreateSwarmRequest: CreateSwarmRequest = {
  title: '',
  goal: '',
  informationGraphId: ''
}

export function CreateSwarmDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user, refetch } = useFetchUser()
  const [createSwarmRequest, setCreateSwarmRequest] = useState<CreateSwarmRequest>(initialCreateSwarmRequest)
  const [isCreateMemoryDialogOpen, setIsCreateMemoryDialogOpen] = useState(false)
  const [createSwarm] = useCreateSwarmMutation()

  const openCreateMemoryDialog = () => {
    setIsCreateMemoryDialogOpen(true)
  }

  const handleCreateSwarm = async () => {
    try {
      await createSwarm({ variables: { input: createSwarmRequest } });
      onOpenChange(false);
      setCreateSwarmRequest(initialCreateSwarmRequest);
      await refetch(); // Refetch user data after creating a new swarm
    } catch (error) {
      console.error("Error creating swarm:", error);
    }
  };

  const isSpawnButtonDisabled = !createSwarmRequest.informationGraphId || !createSwarmRequest.title || !createSwarmRequest.goal

  console.log(user?.informationGraphs)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-secondary border-2 rounded-2xl bg-background">
        <div className="grid w-full items-start h-full overflow-auto gap-6 p-2 mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Input
              id="source"
              className="bg-secondary rounded-2xl"
              placeholder="Swarm Name"
              autoComplete="off"
              value={createSwarmRequest.title}
              onChange={(e) => setCreateSwarmRequest({ ...createSwarmRequest, title: e.target.value })}
            />
            <SelectWithCreate
              className="hover:bg-muted/50 text-sm h-9 bg-secondary rounded-2xl"
              create={openCreateMemoryDialog}
              createMessage="Create"
              options={user?.informationGraphs?.map(informationGraph => ({ value: informationGraph.id, label: informationGraph.title ?? 'Untitled Information Graph' })) ?? []}
              onSelect={
                (value) => {
                  setCreateSwarmRequest({ ...createSwarmRequest, informationGraphId: value });
                }
              }
              placeholder="Information Graph"
              selectedValue={createSwarmRequest.informationGraphId}
              emptyMessage="No information graphs found"
            />
          </div>
          <Textarea
            className="min-h-[9.5rem] max-h-[60vh] bg-secondary rounded-2xl"
            id="source"
            placeholder="Create a new feature in the sourcing app."
            value={createSwarmRequest.goal}
            onChange={(e) => setCreateSwarmRequest({ ...createSwarmRequest, goal: e.target.value })}
          />
          <CreateInformationDialog
            open={isCreateMemoryDialogOpen}
            onOpenChange={(open) => {
              setIsCreateMemoryDialogOpen(open);
              if (!open) {
                refetch(); // Refetch user data when the CreateInformationDialog closes
              }
            }}
          />
        </div>
        <div className="flex justify-end mr-0">
          <ButtonWithTooltipWhenDisabled 
            className="max-w-[100px] px-10" 
            onClick={handleCreateSwarm} 
            disabled={isSpawnButtonDisabled}
            tooltipText="Please fill in all required fields"
            ariaLabel="Spawn swarm"
            variant="default"
          >
            Spawn
          </ButtonWithTooltipWhenDisabled>
        </div>
      </DialogContent>
    </Dialog>
  )
}