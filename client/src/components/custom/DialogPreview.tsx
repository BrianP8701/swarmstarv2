import { useState, ReactElement } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";

interface DialogPreviewProps {
  previewComponent: ReactElement;
  dialogContent: ReactElement;
}

export default function DialogPreview({ previewComponent, dialogContent }: DialogPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="w-full h-full cursor-pointer">
          {previewComponent}
        </div>
      </DialogTrigger>
      <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw]">
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}