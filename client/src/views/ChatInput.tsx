import { useState, useRef, useEffect } from "react"
import { CornerDownLeft, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ChatInput() {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`
    }
  }, [message])

  return (
    <div className="relative overflow-hidden rounded-lg bg-background w-full min-h-[48px] max-h-[240px]">
      <Textarea
        ref={textareaRef}
        id="message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        className=" resize-none border-0 py-3 pl-3 pr-14 w-full"
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-2 bottom-3.5 rounded-full"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  )
}