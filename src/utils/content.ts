import { type RefObject, type MouseEvent as ReactMouseEvent } from 'react'
import { DIALOG_HEIGHT, DIALOG_POSITION_PADDING, DIALOG_WIDTH } from '../../constants'

export const getDialogPosition = (textBounds: DOMRect) => {
  // TODO: Keep dialog within viewport bounds
  const { top, left, width, height } = textBounds
  const dialogLeft = left + width / 2 - DIALOG_WIDTH / 2
  const dialogTop = top + height / 2 - DIALOG_HEIGHT - DIALOG_POSITION_PADDING

  return {
    top: `${dialogTop}px`,
    left: `${dialogLeft}px`,
  }
}

// TOOD: Make this pretty or a hook
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
      containerRef.current.style.top = containerRef.current.offsetTop - deltaY + 'px'
      containerRef.current.style.left = containerRef.current.offsetLeft - deltaX + 'px'
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
