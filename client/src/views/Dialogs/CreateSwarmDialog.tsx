import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SelectWithCreate from "@/components/custom/SelectWithCreate"
import { useState } from "react"
import { useFetchUser } from "../../hooks/fetchUser"
import { CreateMemoryDialog } from "./CreateMemoryDialog"
import { CreateSwarmRequest, useCreateSwarmMutation } from "@/graphql/generated/graphql"

const initialCreateSwarmRequest: CreateSwarmRequest = {
  title: '',
  goal: '',
  informationGraphId: ''
}

export function CreateSwarmDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useFetchUser()
  const [createSwarmRequest, setCreateSwarmRequest] = useState<CreateSwarmRequest>(initialCreateSwarmRequest)
  const [isCreateMemoryDialogOpen, setIsCreateMemoryDialogOpen] = useState(false)
  const [createSwarm] = useCreateSwarmMutation()

  const openCreateMemoryDialog = () => {
    setIsCreateMemoryDialogOpen(true)
  }

  const informationGraphs = user?.informationGraphs ?? []

  const handleCreateSwarm = async () => {
    try {
      await createSwarm({ variables: { input: createSwarmRequest } });
      onOpenChange(false);
      setCreateSwarmRequest(initialCreateSwarmRequest);
    } catch (error) {
      console.error("Error creating swarm:", error);
    }
  };

  const isSpawnButtonDisabled = !createSwarmRequest.informationGraphId || !createSwarmRequest.title || !createSwarmRequest.goal

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent >
        <div className="grid w-full items-start h-full overflow-auto gap-6 p-2 mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Input
              id="source"
              placeholder="Swarm Name"
              autoComplete="off"
              value={createSwarmRequest.title}
              onChange={(e) => setCreateSwarmRequest({ ...createSwarmRequest, title: e.target.value })}
            />
            <SelectWithCreate
              className="hover:bg-muted/50 text-sm h-9"
              create={openCreateMemoryDialog}
              createMessage="Create"
              options={informationGraphs.map(informationGraph => ({ value: informationGraph.id, label: informationGraph.title ?? 'Untitled Information Graph' })) ?? []}
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
            className="min-h-[9.5rem] max-h-[60vh]"
            id="source"
            placeholder="Create a new feature in the sourcing app."
            value={createSwarmRequest.goal}
            onChange={(e) => setCreateSwarmRequest({ ...createSwarmRequest, goal: e.target.value })}
          />
          <CreateMemoryDialog
            open={isCreateMemoryDialogOpen}
            onOpenChange={setIsCreateMemoryDialogOpen}
          />
        </div>
        <div className="flex justify-end">
          <Button 
            className="max-w-[100px]" 
            onClick={handleCreateSwarm} 
            disabled={isSpawnButtonDisabled}
          >
            Spawn
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}