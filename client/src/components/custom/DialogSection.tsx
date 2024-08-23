import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

export default function DialogSection({ selectedSwarm }: { selectedSwarm: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="w-full h-full border p-4">Open Dialog</button>
        </DialogTrigger>
        <DialogContent className="w-[90%] h-[90%]">
          <div className="p-4">
            <h2>Dialog for {selectedSwarm}</h2>
            {/* Add your content here */}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}