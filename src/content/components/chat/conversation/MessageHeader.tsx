import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useShallow } from 'zustand/react/shallow'
import { AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { useContentStore } from '../../../store'
import { Badge } from '../../../../shared/components/Badge'
import { languageTagToHumanReadable } from '../../../utils/ai'
import { AIApiType } from '../../../types'
import Copy from '../../../../shared/icons/copy.svg?react'
import CheckMark from '../../../../shared/icons/checkmark.svg?react'
import XMark from '../../../../shared/icons/xmark.svg?react'

interface Props {
  text: string
  isUser: boolean
  type?: AIApiType
}

enum CopyStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  DEFAULT = 'default',
}

const getTypeBackground = (type: AIApiType | undefined) => {
  switch (type) {
    case AIApiType.TRANSLATION:
      return 'bg-badge-translation'
    case AIApiType.SUMMARIZATION:
      return 'bg-badge-summarization'
    case AIApiType.CHAT:
      return 'bg-badge-chat'
    default:
      return ''
  }
}
const getIcon = (status: CopyStatus) => {
  switch (status) {
    case CopyStatus.SUCCESS:
      return <CheckMark className='size-4 fill-success' />
    case CopyStatus.FAILURE:
      return <XMark className='size-4 fill-error' />
    default:
      return <Copy className='size-4 fill-primary group-hover:fill-primary-hover' />
  }
}

const getCopyTextKey = (status: CopyStatus) => {
  switch (status) {
    case CopyStatus.SUCCESS:
      return 'buttons.copy.success'
    case CopyStatus.FAILURE:
      return 'buttons.copy.failure'
    default:
      return 'buttons.copy.default'
  }
}

const ICON_CHANGE_DELAY = 1000

export const MessageHeader = ({ text, isUser, type }: Props) => {
  const [copyIcon, setCopyIcon] = useState<CopyStatus>(CopyStatus.DEFAULT)
  const { t } = useTranslation()
  const { sourceLanguage, targetLanguage } = useContentStore(
    useShallow(state => ({
      sourceLanguage: state.trasnlationSourceLanguage,
      targetLanguage: state.trasnlationTargetLanguage,
    }))
  )

  const copyText = t(getCopyTextKey(copyIcon))
  const userRoleText = t('roles.user')
  const aiRoleText = t('roles.ai')
  const fromLabel = t('from')
  const toLabel = t('to')
  const typeBadgeBackground = getTypeBackground(type)

  const changeBackIconToDefault = () => {
    setTimeout(() => {
      setCopyIcon(CopyStatus.DEFAULT)
    }, ICON_CHANGE_DELAY)
  }

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(text)
      setCopyIcon(CopyStatus.SUCCESS)
      changeBackIconToDefault()
    } catch (e) {
      setCopyIcon(CopyStatus.FAILURE)
      changeBackIconToDefault()
    }
  }

  const isDefaultIcon = copyIcon === CopyStatus.DEFAULT

  return (
    <div className='flex items-center justify-end gap-2 bg-tertiary py-0.5 pr-2'>
      {type ? <Badge className={typeBadgeBackground}>{type}</Badge> : null}
      {type === AIApiType.TRANSLATION ? (
        <Badge className='bg-badge-translation'>
          {fromLabel}: {languageTagToHumanReadable(sourceLanguage)}
        </Badge>
      ) : null}
      {type === AIApiType.TRANSLATION ? (
        <Badge className='bg-badge-translation'>
          {toLabel}: {languageTagToHumanReadable(targetLanguage)}
        </Badge>
      ) : null}
      <Badge className={isUser ? 'bg-badge-user' : 'bg-badge-ai'}>{isUser ? userRoleText : aiRoleText}</Badge>
      <button
        className={`group flex  justify-center p-2  ${isDefaultIcon ? 'cursor-pointer hover:bg-tertiary-hover' : 'pointer-events-none'} `}
        onClick={isDefaultIcon ? handleCopy : undefined}
      >
        <AccessibleIcon label={copyText}>{getIcon(copyIcon)}</AccessibleIcon>
      </button>
    </div>
  )
}
