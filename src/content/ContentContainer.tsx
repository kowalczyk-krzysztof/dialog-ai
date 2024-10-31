import { useEffect, useRef, useState } from 'react'
import { DialogContent, DialogPortal, Root as DialogRoot } from '@radix-ui/react-dialog'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from './store'
import { useTextSelection } from '../shared/hooks/useTextSelection'
import { DIALOG_HEIGHT, DIALOG_WIDTH, DIALOG_Z_INDEX } from '../../constants'
import { getContentRoot, getDialogPositionRelativeToSelection, isOpeningDialog } from './utils/content'
import { ChatContainer } from './components/chat/ChatContainer'
import { checkAiApiAvailability } from './utils/ai'
import type { FocusOutsideEvent, PointerDownOutsideEvent } from './types'
import { ContentHeader } from './components/ContentHeader'
import { SettingsContainer } from './components/settings/SettingsContainer'

export const ContentContainer = () => {
  const root = getContentRoot()
  const dialogRef = useRef<HTMLDivElement>(null)

  const { setAiApiAvailability, reset, setUserInput, fetchSettings } = useContentStore(
    useShallow(state => ({
      settings: state.settings,
      setAiApiAvailability: state.setAiApiAvailability,
      reset: state.reset,
      setUserInput: state.setUserInput,
      fetchSettings: state.fetchSettings,
    }))
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [position, setPosition] = useState({ top: '0px', left: '0px' })
  const [isSelectionKeyHeldDown, setIsSelectionKeyHeldDown] = useState(false)
  const [isSettingsViewOpen, setIsSettingsViewOpen] = useState(false)

  const selection = useTextSelection(isSelectionKeyHeldDown)

  const clearState = () => {
    reset()
    setIsDialogOpen(false)
  }

  const handleInitialFocus = (e: Event) => {
    e.preventDefault()
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
    const fetchInitialSettings = async () => {
      await fetchSettings()
    }

    const getSettings = async (changes: { [key: string]: chrome.storage.StorageChange }) => {
      if (Object.keys(changes).length) {
        await fetchSettings()
      }
    }

    fetchInitialSettings()

    chrome.storage.onChanged.addListener(getSettings)
    return () => {
      chrome.storage.onChanged.removeListener(getSettings)
    }
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
    if (selection && selection.text.length) {
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
          className='fixed rounded-lg rounded-t-none bg-background text-text border border-border'
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
          <ContentHeader
            dialogRef={dialogRef}
            isSettingsViewOpen={isSettingsViewOpen}
            clearState={clearState}
            setIsSettingsViewOpen={setIsSettingsViewOpen}
          />
          <SettingsContainer isSettingsViewOpen={isSettingsViewOpen} />
          <ChatContainer isSettingsViewOpen={isSettingsViewOpen} />
        </DialogContent>
      </DialogPortal>
    </DialogRoot>
  )
}
