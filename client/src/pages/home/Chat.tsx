import {
  CornerDownLeft,
  Mic,
  Paperclip,
} from "lucide-react"
import { Button } from "@/src/components/ui/button"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select"

export default function Chat() {

  return (
    <div className="relative h-full">
      <div className="flex-1" />
      <Select onValueChange={handleChatChange} value={currentChat || ""}>
        <SelectTrigger className="absolute right-1 top-1 inline-flex min-w-[30px] max-w-[300px]">
          <SelectValue placeholder="Select Chat" />
        </SelectTrigger>
        <SelectContent>
          {chats && chats.length > 0 ? (
            chats.map(([id, name]: [string, string]) => (
              <SelectItem key={id} value={id}>
                {name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no-chats" disabled>
              No chats exist for this swarm.
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      <form
        className="absolute bottom-1 left-0 right-0 overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring" x-chunk="dashboard-03-chunk-1"
      >
        <Label htmlFor="message" className="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3 pt-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Paperclip className="size-4" />
                <span className="sr-only">Attach file</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Attach File</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Mic className="size-4" />
                <span className="sr-only">Use Microphone</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top">Use Microphone</TooltipContent>
          </Tooltip>
          <Button type="submit" size="sm" className="ml-auto gap-1.5">
            Send Message
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  )
}
