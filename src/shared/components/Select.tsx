import { useState } from 'react'
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
import { getContentRoot } from '../../content/utils/content'
import { DIALOG_TOOLTIP_Z_INDEX } from '../../../constants'
import ChevronDown from '../icons/chevron-down.svg?react'
import ChevronUp from '../icons/chevron-up.svg?react'

interface SelectItem {
  key: string
  value: string
  label: string
}

interface Props {
  items: SelectItem[]
  value: SelectItem
  id: string
  disabled?: boolean
  onChange: (value: string) => void
}

export const Select = ({ items, value, id, disabled, onChange }: Props) => {
  const root = getContentRoot()
  const [isOpen, setIsOpen] = useState(false)

  const handleClickTrigger = () => {
    setIsOpen(!isOpen)
  }

  return (
    <SelectRoot value={value.value} disabled={disabled} onValueChange={onChange} onOpenChange={setIsOpen} open={isOpen}>
      <SelectTrigger
        id={id}
        aria-label='source language'
        className='text-sm disabled:text-disabled disabled:cursor-not-allowed px-1 hover:text-text-hover disabled:bg-transparent flex gap-1 items-center group'
        onClick={handleClickTrigger}
      >
        <SelectValue />{' '}
        {isOpen ? (
          <ChevronUp className='size-3 fill-primary group-hover:fill-primary-hover' />
        ) : (
          <ChevronDown className='size-3 fill-primary group-hover:fill-primary-hover group-disabled:fill-disabled-text' />
        )}
      </SelectTrigger>
      <SelectPortal container={root}>
        <SelectContent
          style={{
            zIndex: DIALOG_TOOLTIP_Z_INDEX,
          }}
          position='popper'
          sideOffset={8}
        >
          <SelectViewport className='bg-secondary rounded-lg border-border border'>
            {items.map(({ value, label, key }) => (
              <RadixSelectItem
                key={key}
                value={value}
                className='relative flex h-[25px] select-none items-center rounded-[3px] py-0 pl-[25px] pr-[35px] text-[13px] leading-none text-text focus:bg-primary [&:not(:focus):not(:hover)]:data-[state=checked]:bg-primary-hover [&:not(:focus):not(:hover)]:data-[state=checked]:text-text-hover'
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
