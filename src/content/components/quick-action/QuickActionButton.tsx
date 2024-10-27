import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  disabled?: boolean
  onClick: () => void
}

export const QuickActionButton = ({ children, disabled, onClick }: Props) => (
  <button
    className='rounded-lg bg-primary p-2 hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled'
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
)
