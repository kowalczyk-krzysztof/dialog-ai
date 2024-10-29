import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { DialogContent, DialogPortal, Root as DialogRoot, DialogTitle, DialogClose } from '@radix-ui/react-dialog'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from './store'
import { ConversationContainer } from './components/chat/ConversationContainer'
import { QuickActionContainer } from './components/quick-action/QuickActionContainer'
import { UserInputContainer } from './components/chat/UserInputContainer'
import { useTextSelection } from '../shared/hooks/useTextSelection'
import { DIALOG_HEIGHT, DIALOG_WIDTH, DIALOG_Z_INDEX } from '../../constants'
import { dragHTMLElement, getContentRoot, getDialogPositionRelativeToSelection, isOpeningDialog } from './utils/content'
import { checkAiApiAvailability } from './utils/ai'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from './types'
import Close from '../shared/icons/close.svg?react'

export const ContentContainer = () => {
  const root = getContentRoot()
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
    setIsDialogOpen(false)
  }

  const handleInitialFocus = (e: Event) => {
    e.preventDefault()
  }

  const handleGrab = (e: ReactMouseEvent) => {
    dragHTMLElement(e, dialogRef)
  }

  const handleClickOutside = (e: PointerDownOutsideEvent) => {
    e.preventDefault()
  }

  const handleFocusOutside = (e: PointerDownOutsideEvent | FocusOutsideEvent) => {
    e.preventDefault()
  }

  useEffect(() => {
    window.addEventListener('beforeunload', clearState)
    return () => {
      window.removeEventListener('beforeunload', clearState)
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
          className='fixed flex flex-col gap-2 items-center rounded-lg rounded-t-none bg-background px-4 text-text border border-border'
          style={{
            top: position.top,
            left: position.left,
            zIndex: DIALOG_Z_INDEX,
            width: DIALOG_WIDTH,
            height: DIALOG_HEIGHT,
          }}
          onEscapeKeyDown={clearState}
          onOpenAutoFocus={handleInitialFocus}
          onPointerDownOutside={handleClickOutside}
          onInteractOutside={handleFocusOutside}
        >
          <DialogTitle
            className='flex w-[calc(100%+2rem)] cursor-grab select-none items-center justify-center bg-tertiary p-1 text-center active:cursor-grabbing border-b border-border'
            onMouseDown={handleGrab}
          >
            <p className='grow'>Dialog AI</p>
            <DialogClose className='p-2 hover:bg-tertiary-hover group' onClick={clearState}>
              <AccessibleIcon label={closeText}>
                <Close className=' size-4 fill-primary group-hover:fill-primary-hover' />
              </AccessibleIcon>
            </DialogClose>
          </DialogTitle>
          <ConversationContainer />
          <QuickActionContainer />
          <UserInputContainer />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
