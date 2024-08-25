import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import SwarmConfig from "@/views/SwarmConfig";
import { Button } from "@/components/ui/button";

export function CreateSwarmDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent >
        <SwarmConfig />
        <div className="flex justify-end">
          <Button className="max-w-[100px]">Spawn</Button>
        </div>
      </DialogContent>

    </Dialog>
  );
}