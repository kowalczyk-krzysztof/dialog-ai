import type { MutableRefObject, MouseEvent as ReactMouseEvent, SetStateAction, Dispatch } from 'react'
import { useTranslation } from 'react-i18next'
import { DialogClose, DialogTitle } from '@radix-ui/react-dialog'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { OpenSettingsButton } from './settings/OpenSettingsButton'
import { dragHTMLElement } from '../utils/content'
import Close from '../../shared/icons/xmark.svg?react'

interface Props {
  dialogRef: MutableRefObject<HTMLDivElement | null>
  isSettingsViewOpen: boolean
  setIsSettingsViewOpen: Dispatch<SetStateAction<boolean>>
  clearState: () => void
}

export const ContentHeader = ({ dialogRef, isSettingsViewOpen, clearState, setIsSettingsViewOpen }: Props) => {
  const { t } = useTranslation()

  const closeText = t('buttons.close')
  const titleText = t('dialogTitle')

  const handleGrab = (e: ReactMouseEvent) => {
    dragHTMLElement(e, dialogRef)
  }

  const preventBeingDraggable = (e: ReactMouseEvent) => {
    e.stopPropagation()
  }

  return (
    <DialogTitle
      className='mb-2 flex cursor-grab select-none items-center justify-center border-b border-border bg-tertiary p-1 text-center active:cursor-grabbing'
      onMouseDown={handleGrab}
    >
      <OpenSettingsButton
        isSettingsViewOpen={isSettingsViewOpen}
        setIsSettingsViewOpen={setIsSettingsViewOpen}
        preventBeingDraggable={preventBeingDraggable}
      />
      <p className='grow'>{titleText}</p>
      <DialogClose
        className='group p-2 hover:bg-tertiary-hover'
        onClick={clearState}
        onMouseDown={preventBeingDraggable}
      >
        <AccessibleIcon label={closeText}>
          <Close className='size-4 fill-primary group-hover:fill-primary-hover' />
        </AccessibleIcon>
      </DialogClose>
    </DialogTitle>
  )
}
