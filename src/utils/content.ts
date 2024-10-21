export const setDialogPosition = (dialog: HTMLDialogElement | null, textBounds: DOMRect | undefined) => {
  // TODO: Possibly add a check for whether bounds is in viewport
  if (!dialog || !textBounds) return
  const padding = 10
  const dialogHeight = dialog.getBoundingClientRect().height

  const { top, left } = textBounds
  dialog.style.top = `${top + window.scrollY - dialogHeight - padding}px`
  dialog.style.left = `${left + window.scrollX}px`
}
