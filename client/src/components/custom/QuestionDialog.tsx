import { CircleHelp } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog";

interface QuestionDialogProps {
  dialogContent: React.ReactNode;
}

export default function QuestionDialog({ dialogContent }: QuestionDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <CircleHelp className="cursor-pointer" size={20} />
      </DialogTrigger>
      <DialogContent>
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}