import {
  CornerDownLeft,
  Mic,
  Paperclip,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Chat() {
  const currentChat = "1"; // Temporary constant for currentChat
  const chats = [
    ["1", "Chat 1"],
    ["2", "Chat 2"],
  ]; // Temporary constant for chats

  const handleChatChange = (value: string) => {
    console.log("Selected chat:", value);
  };

  return (
    <div className="relative h-full">
      <div className="flex-1" />
      <Select onValueChange={handleChatChange} value={currentChat || ""}>
        <SelectTrigger className="absolute right-1 top-1 inline-flex min-w-[30px] max-w-[300px]">
          <SelectValue placeholder="Select Chat" />
        </SelectTrigger>
        <SelectContent>
          {chats && chats.length > 0 ? (
            chats.map((chat) => {
              const [id, name] = chat;
              return (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              );
            })
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
