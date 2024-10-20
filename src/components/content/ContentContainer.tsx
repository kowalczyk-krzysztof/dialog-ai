import { useEffect, useRef, useState } from 'react'
import { ChatWindow } from './chat/ChatWindow'
import { debounce } from '../../utils/debounce'
import { CloseButton } from './CloseButton'
import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './chat/UserInputContainer'

export const ContentContainer = () => {
  const [highlightedText, setHighlightedText] = useState('')
  const [response, setResponse] = useState('')
  const containerRef = useRef<HTMLDialogElement>(null)

  const clearState = () => {
    if (containerRef.current) {
      setHighlightedText('')
      setResponse('')
      containerRef.current.close()
    }
  }

  useEffect(() => {
    const handleKeydown = debounce(async (e: KeyboardEvent) => {
      const selection = window.getSelection()
      if (e.ctrlKey && selection && selection.rangeCount > 0) {
        const text = selection.toString()
        const range = selection.getRangeAt(0)
        const { top, left } = range.getBoundingClientRect()
        setHighlightedText(text)

        // TODO: Fix - currently when there is text selected already and you press CTRL, the dialog will open with the previous selection. You need to clear the selection first.
        if (text.length && containerRef.current) {
          const dialogHeight = containerRef.current.getBoundingClientRect().height
          containerRef.current.style.top = `${top + window.scrollY - dialogHeight - 10}px`
          containerRef.current.style.left = `${left + window.scrollX}px`
          containerRef.current.show()
        }
      }
    }, 300)

    document.addEventListener('keydown', handleKeydown)

    return () => {
      document.removeEventListener('keydown', handleKeydown)
    }
  }, [])

  return (
    <dialog id='popupai-content-container' ref={containerRef}>
      <CloseButton clearState={clearState} />
      <ChatWindow text={response} />
      <QuickActionContainer promptText={highlightedText} setResponse={setResponse} />
      <UserInputContainer text={highlightedText} setText={setHighlightedText} />
    </dialog>
  )
}
