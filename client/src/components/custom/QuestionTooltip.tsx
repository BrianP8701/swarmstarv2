import { CircleHelp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/src/components/ui/tooltip";

interface QuestionTooltipProps {
  tooltipText: string;
}

export default function QuestionTooltip({ tooltipText }: QuestionTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <CircleHelp className="cursor-pointer" size={20} />
      </TooltipTrigger>
      <TooltipContent side="right" sideOffset={5}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
