import type { Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import Gear from '../../../shared/icons/gear.svg?react'
import Back from '../../../shared/icons/arrow-left-long.svg?react'

interface Props {
  isSettingsViewOpen: boolean
  setIsSettingsViewOpen: Dispatch<SetStateAction<boolean>>
}

export const OpenSettingsButton = ({ isSettingsViewOpen, setIsSettingsViewOpen }: Props) => {
  const { t } = useTranslation()
  const goBackText = t('buttons.goBack')
  const openSettingsText = t('buttons.openSettings')

  const handeClick = () => {
    setIsSettingsViewOpen(!isSettingsViewOpen)
  }

  return (
    <button className='group p-2 hover:bg-tertiary-hover' onClick={handeClick}>
      <AccessibleIcon label={isSettingsViewOpen ? goBackText : openSettingsText}>
        {isSettingsViewOpen ? (
          <Back className='size-4 fill-primary group-hover:fill-primary-hover' />
        ) : (
          <Gear className='size-4 fill-primary group-hover:fill-primary-hover' />
        )}
      </AccessibleIcon>
    </button>
  )
}
