import { useEffect, useState } from 'react'
import { debounce } from '../utils/debounce'
import { SELECTION_DELAY_MS } from '../../../constants'
import type { TextSelection } from '../../content/types'

export const useTextSelection = (isSelectionKeyPressed: boolean) => {
  const [selection, setSelection] = useState<TextSelection | undefined>(undefined)

  const handleSelection = debounce(() => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

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
