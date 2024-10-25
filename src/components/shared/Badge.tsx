import { PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  className?: string
}

export const Badge = ({ children, className }: Props) => (
  <span
    className={`select-none rounded-full bg-slate-200 p-1 px-2.5 py-0.5 text-xs uppercase text-neutral-900 ${className}`}
  >
    {children}
  </span>
)
