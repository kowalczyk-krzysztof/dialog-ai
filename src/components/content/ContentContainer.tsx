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
  // TODO: Handle multiple responses
  // TODO: Handle multiple user inputs

  const clearState = () => {
    setHighlightedText('')
    setRect(undefined)
    setResponse('')
    setShowContent(false)
  }

  useEffect(() => {
    document.addEventListener(
      'keydown',
      debounce(async (e: KeyboardEvent) => {
        const selection = window.getSelection()
        // TODO: Fix selection logic
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
    )

    return () => {
      document.removeEventListener('keydown', () => {})
    }
  }, [])

  if (!showContent || !rect) return null
  return (
    <div
      id='popupai-content-container'
      style={{
        top: `${rect.top - 50}px`,
        left: `${rect.left}px`,
      }}
    >
      <CloseButton clearState={clearState} />
      <UserInputContainer text={highlightedText} setText={setHighlightedText} />
      <QuickActionContainer promptText={highlightedText} setResponse={setResponse} />
      <ChatWindow text={response} />
    </div>
  )
}
