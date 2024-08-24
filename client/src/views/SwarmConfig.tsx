import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import SelectWithCreate from "@/components/custom/SelectWithCreate";
import { useState } from "react";

export default function SwarmConfig() {
  const memoryOptions: { value: string; label: string }[] = [
    { value: "Memory 1", label: "Memory 1" },
    { value: "Memory 2", label: "Memory 2" },
    { value: "Memory 3", label: "Memory 3" },
  ];
  const [selectedMemory, setSelectedMemory] = useState<string | null>(null);

  const createMemory = () => {

  }

  return (
    <div className="grid w-full items-start h-full overflow-auto gap-6 p-2">
      <div className="grid grid-cols-2 gap-6">
        <Input
          id="source"
          placeholder="Swarm Name"
        />
        <SelectWithCreate
          className="hover:bg-muted/50"
          create={createMemory}
          createMessage="Create"
          options={memoryOptions}
          onSelect={setSelectedMemory}
          placeholder="Select Memory"
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="source" className="flex justify-between items-center">
          Goal
        </Label>
        <Textarea
          className="min-h-[9.5rem]"
          id="source"
          placeholder="Create a new feature in the sourcing app."
        />
      </div>
    </div>

  )
}
