import { type RefObject, type MouseEvent as ReactMouseEvent } from 'react'
import { DIALOG_HEIGHT, DIALOG_POSITION_PADDING, DIALOG_WIDTH } from '../../constants'

export const getDialogPosition = (textBounds: DOMRect) => {
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
  // Initial cursor positions
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

    // Update the element's position
    if (containerRef.current) {
      const element = containerRef.current
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
    if (args[0].includes('DialogTitle')) {
      return
    }
    originalConsoleError(...args)
  }
}
