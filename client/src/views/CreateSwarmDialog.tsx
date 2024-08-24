import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import SwarmConfig from "@/views/SwarmConfig";
import { Button } from "@/components/ui/button";

export function CreateSwarmDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [memoryOptions, setMemoryOptions] = useState<string[]>([]);
  const [selectedMemory, setSelectedMemory] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle>Create New Swarm</DialogTitle>
        </DialogHeader>
        <SwarmConfig />
        <div className="flex justify-end">
          <Button className="max-w-[100px]">Spawn</Button>
        </div>
      </DialogContent>

    </Dialog>
  );
}