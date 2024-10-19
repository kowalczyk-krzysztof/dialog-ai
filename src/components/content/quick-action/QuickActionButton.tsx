import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  onClick: () => void
  disabled?: boolean
}

export const QuickActionButton = ({ children, disabled, onClick }: Props) => (
  <button className='popupai-quick-action-button' disabled={disabled} onClick={onClick}>
    {children}
  </button>
)
