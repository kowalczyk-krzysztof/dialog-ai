export const setPopoverPosition = (popover: HTMLDialogElement | null, textBounds: DOMRect | undefined) => {
  // TODO: Possibly add a check for whether bounds is in viewport
  if (!popover || !textBounds) return
  const padding = 10
  const popoverHeight = popover.getBoundingClientRect().height

  const { top, left } = textBounds
  popover.style.top = `${top + window.scrollY - popoverHeight - padding}px`
  popover.style.left = `${left + window.scrollX}px`
}
