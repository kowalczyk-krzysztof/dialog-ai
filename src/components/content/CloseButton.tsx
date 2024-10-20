interface Props {
  clearState: () => void
}

export const CloseButton = ({ clearState }: Props) => {
  const handleClose = () => {
    clearState()
  }

  return (
    <button className='popover-close-button' onClick={handleClose}>
      X
    </button>
  )
}
