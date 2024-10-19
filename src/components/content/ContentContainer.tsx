import { useEffect, useState } from 'react'
import { ChatWindow } from './ChatWindow'
import { ExplainButton } from './ExplainButton'
import { debounce } from '../../utils/debounce'
import { CloseButton } from './CloseButton'

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

          if (text && rect) {
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
      id="popupai-content-container"
      style={{
        top: `${rect.top - 50}px`,
        left: `${rect.left}px`,
      }}>
      <CloseButton clearState={clearState} />
      {highlightedText}
      <ExplainButton
        setResponse={setResponse}
        promptText={highlightedText}
      />
      <ChatWindow response={response} />
    </div>
  )
}
