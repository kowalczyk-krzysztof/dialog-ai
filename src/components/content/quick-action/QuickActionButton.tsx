import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  disabled?: boolean
  onClick: () => void
}

export const QuickActionButton = ({ children, disabled, onClick }: Props) => (
  <button className='bg-blue-600' disabled={disabled} onClick={onClick}>
    {children}
  </button>
)
