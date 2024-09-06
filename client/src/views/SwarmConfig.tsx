import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import SelectWithCreate from "@/components/custom/SelectWithCreate";
import { useState } from "react";
import { useFetchUser } from "../hooks/fetchUser";

export default function SwarmConfig() {
  const { user } = useFetchUser();

  const [selectedMemory, setSelectedMemory] = useState<string | undefined>(undefined);

  const createMemory = () => {

  }

  const memories = user?.memories ?? [];

  return (
    <div className="grid w-full items-start h-full overflow-auto gap-6 p-2 mt-4">
      <div className="grid grid-cols-2 gap-6">
        <Input
          id="source"
          placeholder="Swarm Name"
          autoComplete="off"
        />
        <SelectWithCreate
          className="hover:bg-muted/50 text-sm h-9"
          create={createMemory}
          createMessage="Create"
          options={memories.map(memory => ({ value: memory.id, label: memory.title ?? 'Untitled Memory' })) ?? []}
          onSelect={setSelectedMemory}
          placeholder="Memory"
          selectedValue={selectedMemory}
        />
      </div>
      <Textarea
        className="min-h-[9.5rem] max-h-[60vh]"
        id="source"
        placeholder="Create a new feature in the sourcing app."
      />
    </div>
  )
}
