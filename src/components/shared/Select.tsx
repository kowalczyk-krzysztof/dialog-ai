import {
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  Root as SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '@radix-ui/react-select'
import { DIALOG_TOOLTIP_Z_INDEX } from '../../../constants'

interface SelectItem {
  key: string
  value: string
  label: string
}

interface Props {
  disabled: boolean
  onChange: (value: string) => void
  items: SelectItem[]
  value: SelectItem
}

export const Select = ({ disabled, items, value, onChange }: Props) => {
  return (
    <SelectRoot value={value.value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger
        aria-label='source language'
        className='inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-blue-600 px-[15px] py-0 text-[13px] leading-none text-slate-200 shadow-[0_2px_10px_var(--black-a7)] disabled:cursor-not-allowed disabled:bg-neutral-400'
      >
        <SelectValue />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          style={{
            zIndex: DIALOG_TOOLTIP_Z_INDEX,
          }}
        >
          <SelectViewport className='bg-slate-500'>
            {items.map(({ value, label, key }) => (
              <SelectItem
                key={key}
                value={value}
                className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-slate-200'
              >
                <SelectItemText>{label}</SelectItemText>
              </SelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  )
}
