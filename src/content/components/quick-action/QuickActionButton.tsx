import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  disabled?: boolean
  onClick: () => void
}

export const QuickActionButton = ({ children, disabled, onClick }: Props) => (
  <button
    className='rounded-lg bg-blue-600 p-2 hover:bg-blue-400 disabled:cursor-not-allowed disabled:bg-disabled'
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
)
