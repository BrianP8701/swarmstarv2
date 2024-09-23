import React, { ReactElement } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";

interface DialogPreviewProps {
  previewComponent: ReactElement;
  dialogContent: ReactElement;
  dialogProps?: Record<string, unknown>;
}

export default function DialogPreview({ previewComponent, dialogContent, dialogProps }: DialogPreviewProps) {
  return (
    <div className="relative w-full h-full bg-neutral-800 rounded-xl">
      <div className="w-full h-full">
        {previewComponent}
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="absolute top-2 right-2 px-1 py-2 z-30"
            variant="ghost"
          >
            <Expand size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw] p-0 rounded-xl bg-neutral-800">
          {React.cloneElement(dialogContent, { ...dialogProps, isDialogMode: true })}
        </DialogContent>
      </Dialog>
    </div>
  );
}