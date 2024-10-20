import { useEffect, useRef, useState } from 'react'

import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'
import { ChatWindow } from './chat/ChatWindow'
import { CloseButton } from './CloseButton'

import { debounce } from '../../utils/debounce'

import { checkAvailability } from '../../utils/ai'
import { type Conversation, type AIAvailability, MessageRole } from '../../types/types'

export const ContentContainer = () => {
  const containerRef = useRef<HTMLDialogElement>(null)
  const [conversation, setConversation] = useState<Conversation>({
    id: '',
    messages: [{ id: '', text: '', role: MessageRole.SYSTEM }],
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
      const selection = window.getSelection()
      if (e.ctrlKey && selection && selection.rangeCount > 0) {
        const text = selection.toString()
        const range = selection.getRangeAt(0)
        const { top, left } = range.getBoundingClientRect()
        setCurrentUserInput(text)

        // TODO: Fix - currently when there is text selected already and you press CTRL, the dialog will open with the previous selection. You need to clear the selection first.
        if (text.length && containerRef.current) {
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

  return (
    <dialog id='popupai-content-container' ref={containerRef}>
      <CloseButton clearState={clearState} />
      {conversation.messages.map(m => {
        return <ChatWindow text={m.text} />
      })}
      <QuickActionContainer
        conversation={conversation}
        setConversation={setConversation}
        quickActions={quickActions}
        currentUserInput={currentUserInput}
        setCurrentUserInput={setCurrentUserInput}
      />
      <UserInputContainer text={currentUserInput} setText={setCurrentUserInput} />
    </dialog>
  )
}
