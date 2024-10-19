import { useEffect, useState } from 'react'
import { ChatWindow } from './chat/ChatWindow'
import { debounce } from '../../utils/debounce'
import { CloseButton } from './CloseButton'
import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'

export const contentContainerId = 'popupai-content-container'

export const ContentContainer = () => {
  const [showContent, setShowContent] = useState(false)
  const [highlightedText, setHighlightedText] = useState('')
  const [rect, setRect] = useState<DOMRect>()
  const [response, setResponse] = useState('')

  const clearState = () => {
    setHighlightedText('')
    setRect(undefined)
    setResponse('')
    setShowContent(false)
  }

  const adjustPositionWithinBounds = (rect: DOMRect): { top: number; left: number } => {
    const padding = 10 // Padding from edges of the viewport
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    let top = rect.top - 50 // Adjust for vertical offset
    let left = rect.left

    // Adjust if going out of viewport bounds
    if (rect.left + rect.width > viewportWidth - padding) {
      left = viewportWidth - rect.width - padding
    }
    if (rect.left < padding) {
      left = padding
    }

    if (rect.top + rect.height > viewportHeight - padding) {
      top = viewportHeight - rect.height - padding
    }
    if (rect.top < padding) {
      top = padding
    }

    return { top, left }
  }

  useEffect(() => {
    const handleKeydown = debounce(async (e: KeyboardEvent) => {
      const selection = window.getSelection()
      if (e.ctrlKey && selection && selection.rangeCount > 0) {
        const text = selection.toString()
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setRect(rect)
        setHighlightedText(text)

        if (text.length && rect) {
          setShowContent(true)
        }
      }
    }, 300)

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  if (!showContent || !rect) return null

  const { top, left } = adjustPositionWithinBounds(rect)

  return (
    <div
      id='popupai-content-container'
      style={{
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
      }}
    >
      <CloseButton clearState={clearState} />
      <UserInputContainer text={highlightedText} setText={setHighlightedText} />
      <QuickActionContainer promptText={highlightedText} setResponse={setResponse} />
      <ChatWindow text={response} />
    </div>
  )
}
