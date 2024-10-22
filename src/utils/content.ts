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
