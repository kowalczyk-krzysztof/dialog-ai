import { type ComponentProps, useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import * as Dialog from '@radix-ui/react-dialog'

import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'
import Close from '../icons/close.svg?react'

import { checkAIApiAvailability, defaultAIApiAvailability } from '../../utils/ai'
import { useTextSelection } from '../../hooks/useTextSelection'

import { type Conversation, type AIApiAvailability } from '../../types/types'
import { CONTENT_ROOT_ID, DIALOG_HEIGHT, DIALOG_WIDTH, DIALOG_Z_INDEX } from '../../../constants'
import { dragHTMLElement, getDialogPosition } from '../../utils/content'
import { ConversationContainer } from './chat/ConversationContainer'

export const ContentContainer = () => {
  const root = document.getElementById(CONTENT_ROOT_ID)?.shadowRoot || document.body
  const conversationId = window.crypto.randomUUID()
  const userInputRef = useRef<HTMLTextAreaElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const [availability, setAvailability] = useState<AIApiAvailability>(defaultAIApiAvailability)
  const [userInput, setUserInput] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [conversation, setConversation] = useState<Conversation>({
    id: conversationId,
    messages: [],
  })
  const [position, setPosition] = useState({ top: '0px', left: '0px' })

  const [isSelectionKeyHeldDown, setIsSelectionKeyHeldDown] = useState(false)
  const selection = useTextSelection(isSelectionKeyHeldDown)

  const clearState = () => {
    setConversation({
      id: '',
      messages: [],
    })
    setUserInput('')
    setIsDialogOpen(false)
  }

  const handleInitialFocus = (e: Event) => {
    e.preventDefault()
    const userInputContainer = userInputRef.current
    if (userInputContainer) {
      userInputRef.current.focus()
      const valueLength = userInputContainer.value.length
      userInputContainer.setSelectionRange(valueLength, valueLength)
      userInputContainer.scrollTop = userInputContainer.scrollHeight
    }
  }

  const handleGrab = (e: ReactMouseEvent) => {
    dragHTMLElement(e, dialogRef)
  }

  const handleClickOutside = (
    e: Parameters<NonNullable<ComponentProps<typeof Dialog.Content>['onPointerDownOutside']>>[0]
  ) => {
    e.preventDefault()
  }

  useEffect(() => {
    const getAIApiAvailability = async () => {
      const response = await checkAIApiAvailability()
      setAvailability(response)
    }
    getAIApiAvailability()
  }, [])

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      // Only set the selection key state if the target is <body>
      if (e.target instanceof HTMLBodyElement) {
        const isReleasingSelectionKey = e.type === 'keyup' && e.shiftKey
        const isPressingSelectionKey = e.type === 'keydown' && e.shiftKey
        setIsSelectionKeyHeldDown(isReleasingSelectionKey ? false : isPressingSelectionKey)
      }
    }

    document.addEventListener('keydown', handleKeyboardEvent)
    document.addEventListener('keyup', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
      document.removeEventListener('keyup', handleKeyboardEvent)
    }
  }, [])

  useEffect(() => {
    if (selection && selection.text.length > 0) {
      setPosition(getDialogPosition(selection.bounds))
      setUserInput(selection.text)
      setIsDialogOpen(true)
    }
  }, [selection])

  return (
    <Dialog.Root modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* The container needs to be set to shadow DOM container or it won't work */}
      <Dialog.Portal container={root}>
        <Dialog.Content
          aria-describedby={undefined}
          ref={dialogRef}
          className='fixed flex flex-col items-center rounded-lg bg-neutral-900 p-4 pt-0 text-slate-200'
          style={{
            top: position.top,
            left: position.left,
            zIndex: DIALOG_Z_INDEX,
            width: DIALOG_WIDTH,
            height: DIALOG_HEIGHT,
          }}
          forceMount
          onEscapeKeyDown={clearState}
          onOpenAutoFocus={handleInitialFocus}
          onPointerDownOutside={handleClickOutside}
        >
          <Dialog.Title
            className='flex w-[calc(100%+2rem)] cursor-grab select-none items-center justify-center rounded-t-lg bg-gray-700 p-1 text-center active:cursor-grabbing'
            onMouseDown={handleGrab}
          >
            <p className='grow'>Dialog AI</p>
            <Dialog.Close onClick={clearState}>
              <Close height={16} width={16} className='fill-slate-200 hover:fill-slate-400' />
            </Dialog.Close>
          </Dialog.Title>

          <ConversationContainer conversation={conversation} />
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
          <Dialog.Description />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
