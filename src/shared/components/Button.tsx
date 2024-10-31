import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  onClick: () => void
  className?: string
  disabled?: boolean
}

export const Button = ({ children, disabled, className, onClick }: Props) => (
  <button
    className={`h-10 rounded-lg bg-primary p-2 hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-text hover:text-text-hover ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
)
