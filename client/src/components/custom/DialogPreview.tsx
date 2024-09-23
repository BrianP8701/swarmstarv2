import { ReactElement } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Expand } from "lucide-react";

interface DialogPreviewProps {
  previewComponent: ReactElement;
  dialogContent: ReactElement;
}

export default function DialogPreview({ previewComponent, dialogContent }: DialogPreviewProps) {
  return (
    <div className="relative w-full h-full bg-slate-800 rounded-xl">
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
        <DialogContent className="w-[95vw] h-[95vh] max-w-[95vw] p-0 bg-slate-800 rounded-xl">
          {dialogContent}
        </DialogContent>
      </Dialog>
    </div>
  );
}