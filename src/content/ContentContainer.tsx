import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { DialogContent, DialogPortal, Root as DialogRoot, DialogTitle, DialogClose } from '@radix-ui/react-dialog'

import Close from './icons/close.svg?react'

import { useTextSelection } from '../shared/hooks/useTextSelection'

import type { PointerDownOutsideEvent } from './types'
import { DIALOG_HEIGHT, DIALOG_WIDTH, DIALOG_Z_INDEX } from '../../constants'
import {
  dragHTMLElement,
  getContentRoot,
  getDialogPositionRelativeToSelection,
  isOpeningDialog,
  setInitialFocusToTextArea,
} from './utils/content'
import { checkAiApiAvailability } from './utils/ai'
import { ConversationContainer } from './components/chat/ConversationContainer'
import { QuickActionContainer } from './components/quick-action/QuickActionContainer'
import { UserInputContainer } from './components/chat/UserInputContainer'
import { useContentStore } from './store'
import { useShallow } from 'zustand/react/shallow'

export const ContentContainer = () => {
  const root = getContentRoot()
  const userInputRef = useRef<HTMLTextAreaElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const { setAiApiAvailability, reset, setUserInput } = useContentStore(
    useShallow(state => ({
      setAiApiAvailability: state.setAiApiAvailability,
      reset: state.reset,
      setUserInput: state.setUserInput,
    }))
  )

  const { t } = useTranslation()
  const closeText = t('buttons.close')

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [position, setPosition] = useState({ top: '0px', left: '0px' })
  const [isSelectionKeyHeldDown, setIsSelectionKeyHeldDown] = useState(false)

  const selection = useTextSelection(isSelectionKeyHeldDown)

  const clearState = () => {
    reset()
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
    window.addEventListener('beforeunload', reset)

    return () => {
      window.removeEventListener('beforeunload', reset)
    }
  }, [])

  useEffect(() => {
    const getAIApiAvailability = async () => {
      const response = await checkAiApiAvailability()
      setAiApiAvailability(response)
    }
    getAIApiAvailability()
  }, [])

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      isOpeningDialog(e, isDialogOpen, setIsDialogOpen, setIsSelectionKeyHeldDown, setPosition)
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
      setPosition(getDialogPositionRelativeToSelection(selection.bounds))
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
          <ConversationContainer />
          <QuickActionContainer />
          <UserInputContainer ref={userInputRef} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
