import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { DialogContent, DialogPortal, Root as DialogRoot, DialogTitle, DialogClose } from '@radix-ui/react-dialog'

import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'
import Close from '../icons/close.svg?react'

import { checkAIApiAvailability, defaultAIApiAvailability } from '../../utils/ai'
import { useTextSelection } from '../../hooks/useTextSelection'

import type {
  Conversation,
  AIApiAvailability,
  PointerDownOutsideEvent,
  ChatSession,
  SummarizationSession,
} from '../../types/types'
import { DIALOG_HEIGHT, DIALOG_WIDTH, DIALOG_Z_INDEX } from '../../../constants'
import {
  dragHTMLElement,
  getContentRoot,
  getDialogPosition,
  isSelectingTextWithModifierKey,
  setInitialFocusToTextArea,
} from '../../utils/content'
import { ConversationContainer } from './chat/ConversationContainer'

export const ContentContainer = () => {
  const root = getContentRoot()
  const conversationId = window.crypto.randomUUID()
  const userInputRef = useRef<HTMLTextAreaElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation()
  const closeText = t('buttons.close')

  const [AIApiAvailability, setAIApiAvailability] = useState<AIApiAvailability>(defaultAIApiAvailability)
  const [isResponseLoading, setIsResponseLoading] = useState(false)
  const [isStreamingResponse, setIsStreamingResponse] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [conversation, setConversation] = useState<Conversation>({
    id: conversationId,
    messages: [],
  })
  const [position, setPosition] = useState({ top: '0px', left: '0px' })
  const [isSelectionKeyHeldDown, setIsSelectionKeyHeldDown] = useState(false)
  const [chatSession, setChatSession] = useState<ChatSession>()
  const [summarizationSession, setSummarizationSession] = useState<SummarizationSession>()

  const selection = useTextSelection(isSelectionKeyHeldDown)

  const clearState = () => {
    setConversation({
      id: '',
      messages: [],
    })
    setUserInput('')
    setIsDialogOpen(false)
    setIsResponseLoading(false)
    setIsStreamingResponse(false)

    if (chatSession) {
      chatSession.destroy()
    }
    if (summarizationSession) {
      summarizationSession.destroy()
    }
  }

  const handleInitialFocus = (e: Event) => {
    setInitialFocusToTextArea(e, userInputRef)
  }

  const handleGrab = (e: ReactMouseEvent) => {
    dragHTMLElement(e, dialogRef)
  }

  const handleClickOutside = (e: PointerDownOutsideEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    const getAIApiAvailability = async () => {
      const response = await checkAIApiAvailability()
      setAIApiAvailability(response)
    }
    getAIApiAvailability()
  }, [])

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      isSelectingTextWithModifierKey(e, isDialogOpen, setIsSelectionKeyHeldDown)
    }

    document.addEventListener('keydown', handleKeyboardEvent)
    document.addEventListener('keyup', handleKeyboardEvent)
    return () => {
      document.removeEventListener('keydown', handleKeyboardEvent)
      document.removeEventListener('keyup', handleKeyboardEvent)
    }
  }, [isDialogOpen])

  useEffect(() => {
    if (selection && selection.text.length > 0) {
      setPosition(getDialogPosition(selection.bounds))
      setUserInput(selection.text)
      setIsDialogOpen(true)
    }
  }, [selection])

  return (
    <DialogRoot modal={false} open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      {/* The container needs to be set to shadow DOM container */}
      <DialogPortal container={root}>
        <DialogContent
          ref={dialogRef}
          forceMount
          aria-describedby={undefined}
          onEscapeKeyDown={clearState}
          onOpenAutoFocus={handleInitialFocus}
          onPointerDownOutside={handleClickOutside}
          className='fixed flex flex-col items-center rounded-lg bg-neutral-900 p-4 pt-0 text-slate-200'
          style={{
            top: position.top,
            left: position.left,
            zIndex: DIALOG_Z_INDEX,
            width: DIALOG_WIDTH,
            height: DIALOG_HEIGHT,
          }}
        >
          <DialogTitle
            onMouseDown={handleGrab}
            className='flex w-[calc(100%+2rem)] cursor-grab select-none items-center justify-center rounded-t-lg bg-gray-700 p-1 text-center active:cursor-grabbing'
          >
            <p className='grow'>Dialog AI</p>
            <DialogClose onClick={clearState}>
              <AccessibleIcon label={closeText}>
                <Close height={16} width={16} className='fill-slate-200 hover:fill-slate-400' />
              </AccessibleIcon>
            </DialogClose>
          </DialogTitle>
          <ConversationContainer conversation={conversation} isResponseLoading={isResponseLoading} />
          <QuickActionContainer
            userInput={userInput}
            AIApiAvailability={AIApiAvailability}
            isResponseLoading={isResponseLoading}
            summarizationSession={summarizationSession}
            isStreamingResponse={isStreamingResponse}
            setConversation={setConversation}
            setUserInput={setUserInput}
            setIsResponseLoading={setIsResponseLoading}
            setSummarizationSession={setSummarizationSession}
          />
          <UserInputContainer
            ref={userInputRef}
            userInput={userInput}
            disabled={!AIApiAvailability.chat.available}
            isResponseLoading={isResponseLoading}
            chatSession={chatSession}
            isStreamingResponse={isStreamingResponse}
            setConversation={setConversation}
            setUserInput={setUserInput}
            setIsResponseLoading={setIsResponseLoading}
            setChatSession={setChatSession}
            setIsStreamingResponse={setIsStreamingResponse}
          />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
