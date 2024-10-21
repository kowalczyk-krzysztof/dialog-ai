import { useEffect, useState } from 'react'
import { TextSelection } from '../types/types'
import { debounce } from '../utils/debounce'

const SELECTION_DELAY_MS = 500

export const useTextSelection = (isSelectionKeyPressed: boolean) => {
  const [selection, setSelection] = useState<TextSelection | undefined>(undefined)

  const handleSelection = debounce(() => {
    const selection = window.getSelection()
    if (!selection) return

    const text = selection.toString().trim()
    const range = selection.getRangeAt(0)
    const bounds = range.getBoundingClientRect()

    setSelection({
      text,
      bounds,
    })

    selection.removeAllRanges()
  }, SELECTION_DELAY_MS)

  useEffect(() => {
    if (!isSelectionKeyPressed) return
    const handleSelectionChange = () => {
      handleSelection()
    }

    document.addEventListener('selectionchange', handleSelectionChange)
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange)
    }
  }, [isSelectionKeyPressed, handleSelection])

  return selection
}
