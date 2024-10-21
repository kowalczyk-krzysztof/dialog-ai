import { useEffect, useRef, useState } from 'react'

import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'
import { ChatWindow } from './chat/ChatWindow'
import { CloseButton } from './CloseButton'

import { checkAvailability } from '../../utils/ai'
import { setDialogPosition } from '../../utils/content'
import { useTextSelection } from '../../hooks/useTextSelection'

import { type Conversation, type AIAvailability, MessageRole } from '../../types/types'

export const ContentContainer = () => {
  const containerRef = useRef<HTMLDialogElement>(null)
  const conversationId = window.crypto.randomUUID()
  const [conversation, setConversation] = useState<Conversation>({
    id: conversationId,
    messages: [],
  })

  const [isSelectionKeyHeldDown, setIsSelectionKeyHeldDown] = useState(false)
  const selection = useTextSelection(isSelectionKeyHeldDown)

  const [userInput, setUserInput] = useState('')
  const [availability, setAvailability] = useState<AIAvailability>({
    prompt: {
      available: false,
    },
    summarization: {
      available: false,
    },
    translation: {
      available: false,
    },
  })

  const clearState = () => {
    if (containerRef.current) {
      setConversation({
        id: '',
        messages: [],
      })
      containerRef.current.close()
    }
  }

  useEffect(() => {
    const getAvailability = async () => {
      const response = await checkAvailability()
      setAvailability(response)
    }
    getAvailability()
  }, [])

  useEffect(() => {
    const dialog = containerRef.current

    const handleSelectionKey = (e: KeyboardEvent) => {
      setIsSelectionKeyHeldDown(e.shiftKey && Boolean(!dialog?.open))
    }

    document.addEventListener('keydown', handleSelectionKey)
    document.addEventListener('keyup', handleSelectionKey)
    return () => {
      document.removeEventListener('keydown', handleSelectionKey)
      document.removeEventListener('keyup', handleSelectionKey)
    }
  }, [])

  useEffect(() => {
    const dialog = containerRef.current
    if (!dialog || dialog.open) return

    const selectionText = selection?.text || ''
    if (!selectionText) return

    setUserInput(selectionText)
    setDialogPosition(dialog, selection?.bounds)

    dialog.show()
  }, [selection])

  // TODO: Auto scroll, styling, keep sessions open and add send button
  return (
    <dialog id='dialogai-content-container' ref={containerRef}>
      <CloseButton clearState={clearState} />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          height: '300px',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '364px',
          boxSizing: 'border-box',
        }}
      >
        {conversation.messages.map(({ role, id, text }) => {
          const isUser = role === MessageRole.USER
          return <ChatWindow text={text} isUser={isUser} key={id} />
        })}
      </div>
      <div>
        <QuickActionContainer
          setConversation={setConversation}
          availability={availability}
          userInput={userInput}
          setUserInput={setUserInput}
        />
        <UserInputContainer
          setConversation={setConversation}
          disabled={!availability.prompt.available}
          userInput={userInput}
          setUserInput={setUserInput}
        />
      </div>
    </dialog>
  )
}
