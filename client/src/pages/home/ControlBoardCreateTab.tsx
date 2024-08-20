import { Label } from "@/src/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"
import QuestionTooltip from "@/src/components/custom/QuestionTooltip"
import { Textarea } from "@/src/components/ui/textarea"
import { Input } from "@/src/components/ui/input"
import SelectOrCreate from "@/src/components/custom/SelectOrCreate";
import { Button } from "@/src/components/ui/button";

interface SpawnControlBoardCreateTabProps {
  memoryOptions: string[];
  setMemoryOptions: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedMemory: React.Dispatch<React.SetStateAction<string>>;
}

export default function SpawnControlBoardCreateTab({ memoryOptions, setMemoryOptions, setSelectedMemory }: SpawnControlBoardCreateTabProps) {
  return (

    <form className="grid w-full items-start gap-6 h-full overflow-auto">
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Configure New Swarm
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="source" className="flex justify-between items-center">
            Name
          </Label>
          <Input
            id="source"
            placeholder="My Swarm"
          />
        </div>
        <div className="grid gap-3">
          <Label htmlFor="source" className="flex justify-between items-center">
            Source
            <QuestionTooltip tooltipText="Local path to root of the directory containing the source code or a github repository link." />
          </Label>
          <Input
            id="source"
            placeholder="/Users/brianprzezdziecki/Code/sourcing"
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
      </fieldset>
      <fieldset className="grid gap-6 rounded-lg border p-4">
        <legend className="-ml-1 px-1 text-sm font-medium">
          Configure Swarm Memory
        </legend>
        <div className="grid gap-3">
          <Label htmlFor="source" className="flex justify-between items-center">
            Memory
          </Label>
          <SelectOrCreate
            placeholder="Select memory"
            newOptionPlaceholder="Create new memory"
            options={memoryOptions}
            setSelectedOption={setSelectedMemory}
            setOptions={setMemoryOptions}
          />
        </div>
      </fieldset>
      <Button className="max-w-[100px]">Spawn</Button>
    </form>
  )
}
