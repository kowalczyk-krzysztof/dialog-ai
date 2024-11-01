import { useEffect, useRef, useState } from 'react'
import { DialogContent, DialogPortal, Root as DialogRoot } from '@radix-ui/react-dialog'
import { useShallow } from 'zustand/react/shallow'
import { useContentStore } from './store'
import { useTextSelection } from '../shared/hooks/useTextSelection'
import { ChatContainer } from './components/chat/ChatContainer'
import { ContentHeader } from './components/ContentHeader'
import { SettingsContainer } from './components/settings/SettingsContainer'
import { getContentRoot, getDialogPositionRelativeToSelection, isOpeningDialog } from './utils/content'
import { checkAiApiAvailability } from './utils/ai'
import { DIALOG_HEIGHT, DIALOG_WIDTH, DIALOG_Z_INDEX } from '../../constants'
import type { FocusOutsideEvent, PointerDownOutsideEvent, ExtensionSettings } from './types'

export const ContentContainer = () => {
  const root = getContentRoot()
  const dialogRef = useRef<HTMLDivElement>(null)

  const { settings, setSettings, setAiApiAvailability, reset, setUserInput, fetchSettings } = useContentStore(
    useShallow(state => ({
      settings: state.settings,
      setSettings: state.setSettings,
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
    setIsSettingsViewOpen(false)
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

    const watchChanges = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      setSettings((settings: ExtensionSettings) =>
        Object.entries(settings).reduce((acc: ExtensionSettings, [key]) => {
          const typedKey = key as keyof ExtensionSettings
          if (typedKey === 'loading') {
            acc[typedKey] = false
            return acc
          }

          if (changes[typedKey]) {
            // @ts-expect-error FIXME
            acc[typedKey] = changes[typedKey].newValue
            return acc
          }
          // @ts-expect-error FIXME
          acc[typedKey] = settings[typedKey]
          return acc
        }, {} as ExtensionSettings)
      )
    }

    fetchInitialSettings()

    chrome.storage.onChanged.addListener(watchChanges)
    return () => {
      chrome.storage.onChanged.removeListener(watchChanges)
    }
  }, [])

  useEffect(() => {
    const handleKeyboardEvent = (e: KeyboardEvent) => {
      isOpeningDialog(e, isDialogOpen, setIsDialogOpen, setIsSelectionKeyHeldDown, setPosition, setIsSettingsViewOpen)
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
