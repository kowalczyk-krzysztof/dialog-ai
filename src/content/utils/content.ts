import type { RefObject, MouseEvent as ReactMouseEvent, Dispatch, SetStateAction } from 'react'
import {
  CONTENT_ROOT_ID,
  DIALOG_HEIGHT,
  DIALOG_POSITION_PADDING,
  DIALOG_WIDTH,
  OPEN_DIALOG_COMBINATION_SECOND_KEY,
  OPEN_DIALOG_COMBINATION_MODIFIER_KEY,
} from '../../../constants'

export const getDialogPositionRelativeToSelection = (textBounds: DOMRect) => {
  const { top, left, width, height } = textBounds
  const dialogLeft = left + width / 2 - DIALOG_WIDTH / 2
  const dialogTop = top + height / 2 - DIALOG_HEIGHT - DIALOG_POSITION_PADDING

  return {
    top: `${dialogTop <= 0 ? 0 : dialogTop}px`,
    left: `${dialogLeft <= 0 ? 0 : dialogLeft}px`,
  }
}

export const dragHTMLElement = (e: ReactMouseEvent, containerRef: RefObject<HTMLElement>) => {
  e.preventDefault()
  // Initial cursor position
  let initialClientX = e.clientX
  let initialClientY = e.clientY

  const trackMovement = (e: MouseEvent) => {
    e.preventDefault()
    // Calculate new cursor positions
    const deltaX = initialClientX - e.clientX
    const deltaY = initialClientY - e.clientY

    // Update initial positions for the next movement
    initialClientX = e.clientX
    initialClientY = e.clientY
    const element = containerRef.current
    const willChangeClass = 'will-change-[top,left]'

    // Update the element's position
    if (element) {
      element.classList.add(willChangeClass)
      const newTop = element.offsetTop - deltaY
      const newLeft = element.offsetLeft - deltaX

      // Get element dimensions
      const elementWidth = element.offsetWidth
      const elementHeight = element.offsetHeight

      // Get the viewport dimensions
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Calculate the scrollbar width
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

      // Constrain the position to keep it within the viewport
      const constrainedTop = Math.max(0, Math.min(newTop, viewportHeight - elementHeight))
      const constrainedLeft = Math.max(0, Math.min(newLeft, viewportWidth - elementWidth - scrollbarWidth))

      element.style.top = `${constrainedTop}px`
      element.style.left = `${constrainedLeft}px`
      element.classList.remove(willChangeClass)
    }
  }

  const dropHTMLElement = () => {
    document.onmouseup = null
    document.onmousemove = null
    document.removeEventListener('mousemove', trackMovement)
    document.removeEventListener('mouseup', dropHTMLElement)
  }

  document.addEventListener('mouseup', dropHTMLElement)
  document.addEventListener('mousemove', trackMovement)
}

// radix-ui does not recognize the existence of Dialog.Title when dialog is rendered in shadow DOM
export const suppressInvalidRadixUiTitleError = () => {
  const originalConsoleError = console.error
  console.error = (...args) => {
    if (typeof args[0] === 'string' && args[0].includes('DialogTitle')) {
      return
    }
    originalConsoleError(...args)
  }
}

export const getCenterOfTheScreen = () => ({
  top: `${window.innerHeight / 2 - DIALOG_HEIGHT / 2}px`,
  left: `${window.innerWidth / 2 - DIALOG_WIDTH / 2}px`,
})

export const getContentRoot = () => document.getElementById(CONTENT_ROOT_ID)?.shadowRoot || document.body

export const isOpeningDialog = (
  e: KeyboardEvent,
  isDialogOpen: boolean,
  setIsDialogOpen: Dispatch<SetStateAction<boolean>>,
  setIsSelectionKeyHeldDown: Dispatch<SetStateAction<boolean>>,
  setPosition: Dispatch<SetStateAction<{ top: string; left: string }>>,
  setIsSettingsViewOpen: Dispatch<SetStateAction<boolean>>
) => {
  // Only set the selection key state if the target is <body> and the dialog is not open
  if (e.target instanceof HTMLBodyElement && !isDialogOpen) {
    if (
      e[OPEN_DIALOG_COMBINATION_MODIFIER_KEY] &&
      (e.key === OPEN_DIALOG_COMBINATION_SECOND_KEY || e.key === OPEN_DIALOG_COMBINATION_SECOND_KEY.toLowerCase())
    ) {
      e.preventDefault() // This prevents OPEN_DIALOG_COMBINATION_SECOND_KEY from being typed in the text area
      const center = getCenterOfTheScreen()
      setPosition(center)
      setIsSettingsViewOpen(false)
      setIsDialogOpen(true)
      setIsSelectionKeyHeldDown(false)
      return
    }

    const isReleasingSelectionKey = e.type === 'keyup' && e[OPEN_DIALOG_COMBINATION_MODIFIER_KEY]
    const isPressingSelectionKey = e.type === 'keydown' && e[OPEN_DIALOG_COMBINATION_MODIFIER_KEY]
    setIsSelectionKeyHeldDown(isReleasingSelectionKey ? false : isPressingSelectionKey)
  } else {
    setIsSelectionKeyHeldDown(false)
  }
}
