import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  onClick: () => void
  className?: string
  disabled?: boolean
}

export const Button = ({ children, disabled, className, onClick }: Props) => (
  <button
    className={`h-10 rounded-lg bg-primary p-2 hover:bg-primary-hover hover:text-text-hover disabled:cursor-not-allowed disabled:bg-disabled disabled:text-disabled-text ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
)
