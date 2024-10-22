import { useEffect, useRef, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'
import { ChatWindow } from './chat/ChatWindow'
import X from '../icons/x.svg?react'

import { checkAvailability } from '../../utils/ai'
import { useTextSelection } from '../../hooks/useTextSelection'

import { type Conversation, type AIAvailability, MessageRole } from '../../types/types'
import { CONTENT_ROOT_ID, DIALOG_Z_INDEX } from '../../../constants'

export const ContentContainer = () => {
  const root = document.getElementById(CONTENT_ROOT_ID)?.shadowRoot || document.body
  const conversationId = window.crypto.randomUUID()
  const userInputRef = useRef<HTMLTextAreaElement>(null)

  const [open, setOpen] = useState(false)
  const [conversation, setConversation] = useState<Conversation>({
    id: conversationId,
    messages: [],
  })

  const [position, setPosition] = useState({ top: '0', left: '0' })

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
    setConversation({
      id: '',
      messages: [],
    })
    setUserInput('')
    setOpen(false)
  }

  const handleInitialFocus = (e: Event) => {
    e.preventDefault()
    userInputRef.current?.focus()
  }

  useEffect(() => {
    const getAvailability = async () => {
      const response = await checkAvailability()
      setAvailability(response)
    }
    getAvailability()
  }, [])

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      setIsSelectionKeyHeldDown(e.shiftKey && !open) // Only trigger selection when dialog is closed
    }

    document.addEventListener('keydown', handleKeyboardEvent)
    document.addEventListener('keyup', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
      document.removeEventListener('keyup', handleKeyboardEvent)
    }
  }, [])

  useEffect(() => {
    const padding = 10
    const dialogHeight = 400

    if (selection) {
      const { top, left } = selection.bounds
      // FIXME: Fix the dialog position
      setPosition({
        top: `${top + window.scrollY - dialogHeight - padding}px`,
        left: `${left + window.scrollX}px`,
      })
      setUserInput(selection.text)
      setOpen(true)
    }
  }, [selection])

  return (
    <Dialog.Root modal={false} open={open} onOpenChange={setOpen}>
      {/* The container needs to be set to shadow DOM container or it won't work */}
      <Dialog.Portal container={root}>
        <Dialog.Content
          className='fixed w-[400px] h-[400px] bg-[#1e1e1e] shadow-[0_4px_10px_rgba(255,255,255,0.2),0_2px_4px_rgba(255,255,255,0.1)] text-neutral-300 flex flex-col items-center pt-6 p-2 rounded-lg'
          style={{ top: position.top, left: position.left, zIndex: DIALOG_Z_INDEX }}
          forceMount
          onEscapeKeyDown={clearState}
          onOpenAutoFocus={handleInitialFocus}
        >
          <Dialog.Title>Dialog AI</Dialog.Title>
          <Dialog.Close className='absolute top-2 right-2'>
            <X height={14} width={14} fill='#FAFAFA' />
          </Dialog.Close>
          <div className='flex flex-col gap-2 h-[300px] overflow-y-auto overflow-x-hidden w-[364px] box-border'>
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
              ref={userInputRef}
              setConversation={setConversation}
              disabled={!availability.prompt.available}
              userInput={userInput}
              setUserInput={setUserInput}
            />
          </div>
          <Dialog.Description />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
