import type { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  className?: string
}

export const Badge = ({ children, className }: Props) => (
  <span className={`select-none rounded-full p-1 px-2.5 py-0.5 text-xs uppercase ${className}`}>{children}</span>
)
