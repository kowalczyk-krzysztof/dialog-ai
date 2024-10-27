import {
  SelectContent,
  SelectItem as RadixSelectItem,
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
  items: SelectItem[]
  value: SelectItem
  onChange: (value: string) => void
}

export const Select = ({ disabled, items, value, onChange }: Props) => {
  return (
    <SelectRoot value={value.value} disabled={disabled} onValueChange={onChange}>
      <SelectTrigger
        aria-label='source language'
        className='text-xs disabled:text-disabled disabled:cursor-not-allowed px-1'
      >
        <SelectValue />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent
          style={{
            zIndex: DIALOG_TOOLTIP_Z_INDEX,
          }}
          position='popper'
          align='center'
        >
          <SelectViewport className='bg-background'>
            {items.map(({ value, label, key }) => (
              <RadixSelectItem
                key={key}
                value={value}
                className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-text focus:bg-secondary'
              >
                <SelectItemText>{label}</SelectItemText>
              </RadixSelectItem>
            ))}
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </SelectRoot>
  )
}
