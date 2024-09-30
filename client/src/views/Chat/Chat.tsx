import { useState } from 'react'
import { PanelRightOpen, PanelRightClose } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatContent } from './ChatContent'
import ChatSidebar from '@/views/Chat/ChatSidebar'
import { SwarmFragment, useSendMessageMutation } from '@/graphql/generated/graphql'

export interface ChatProps {
  swarm: SwarmFragment | undefined
  isDialogMode?: boolean
  selectedChatId: string | null
  setSelectedChatId: (value: string | null) => void
}

export default function Chat({ swarm, isDialogMode, selectedChatId, setSelectedChatId }: ChatProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [sendMessage, { loading }] = useSendMessageMutation()

  const chats = swarm?.chats?.map(chat => ({ value: chat.id, label: chat.title ?? chat.id })) ?? []

  const onSendMessage = async (message: string) => {
    if (!selectedChatId) return
    await sendMessage({ variables: { input: { chatId: selectedChatId, content: message } } })
  }

  return (
    <div className='relative flex flex-col h-full rounded-xl bg-secondary'>
      <Button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className='absolute top-2 left-2 px-1 py-2 z-30'
        variant='ghost'
      >
        {isSidebarOpen ? <PanelRightClose size={20} /> : <PanelRightOpen size={20} />}
      </Button>
      <div
        className={`z-20 absolute top-0 left-0 h-full transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-0'} overflow-hidden`}
      >
        <ChatSidebar options={chats} selectedChatId={selectedChatId} setSelectedChatId={setSelectedChatId} />
      </div>
      <ChatContent
        swarm={swarm}
        isDialogMode={isDialogMode}
        selectedChatId={selectedChatId}
        sendMessageLoading={loading}
        onSendMessage={onSendMessage}
      />
    </div>
  )
}
