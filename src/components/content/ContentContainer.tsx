import { useEffect, useRef, useState } from 'react'

import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'
import { ChatWindow } from './chat/ChatWindow'
import { CloseButton } from './CloseButton'

import { debounce } from '../../utils/debounce'

import { checkAvailability } from '../../utils/ai'
import { type Conversation, type AIAvailability } from '../../types/types'

export const ContentContainer = () => {
  const conversationId = window.crypto.randomUUID()
  const containerRef = useRef<HTMLDialogElement>(null)

  const [conversation, setConversation] = useState<Conversation>({
    id: conversationId,
    messages: [],
  })
  const [currentUserInput, setCurrentUserInput] = useState('')
  const [quickActions, setQuickActions] = useState<AIAvailability>({
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
      setQuickActions(response)
    }

    getAvailability()
  }, [])

  useEffect(() => {
    const handleKeydown = debounce(async (e: KeyboardEvent) => {
      const container = containerRef.current
      if (container?.open) {
        return
      }

      const selection = window.getSelection()
      if (e.ctrlKey && selection && selection.rangeCount > 0) {
        const text = selection.toString()
        const range = selection.getRangeAt(0)
        const { top, left } = range.getBoundingClientRect()
        setCurrentUserInput(text)

        if (text.length && container) {
          const dialogHeight = containerRef.current.getBoundingClientRect().height
          containerRef.current.style.top = `${top + window.scrollY - dialogHeight - 10}px`
          containerRef.current.style.left = `${left + window.scrollX}px`
          containerRef.current.show()
        }
      }
    }, 300)

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  // TODO: Auto scroll, styling, keep sessions open and add send button
  return (
    <dialog id='popupai-content-container' ref={containerRef}>
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
          const isUser = role === 'user'
          return <ChatWindow text={text} isUser={isUser} key={id} />
        })}
      </div>
      <div>
        <QuickActionContainer
          setConversation={setConversation}
          quickActions={quickActions}
          currentUserInput={currentUserInput}
          setCurrentUserInput={setCurrentUserInput}
        />
        <UserInputContainer currentUserInput={currentUserInput} setCurrentUserInput={setCurrentUserInput} />
      </div>
    </dialog>
  )
}
