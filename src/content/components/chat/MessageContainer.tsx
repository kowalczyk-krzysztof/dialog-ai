import Markdown from 'markdown-to-jsx'
import { useTranslation } from 'react-i18next'
import { Root as AccessibleIcon } from '@radix-ui/react-accessible-icon'
import { AIApiType } from '../../types'

import Copy from '../../icons/copy.svg?react'
import { Badge } from '../../../shared/components/Badge'

interface Props {
  text: string
  isUser: boolean
  isError?: boolean
  type?: AIApiType
}

const getMessageBackground = (isUser: boolean, isError?: boolean) => {
  if (isError) {
    return 'bg-red-600'
  }
  return isUser ? 'bg-secondary' : 'bg-secondary-hover'
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

const copyToClipboard = (text: string) => {
  try {
    navigator.clipboard.writeText(text)
  } catch (e) {}
}

export const MessageContainer = ({ text, isUser, isError, type }: Props) => {
  const { t } = useTranslation()
  const copyText = t('buttons.copy')
  const userRoleText = t('roles.user')
  const aiRoleText = t('roles.ai')
  const messageBackground = getMessageBackground(isUser, isError)
  const typeBadgeBackground = getTypeBackground(type)

  const handleCopy = () => {
    copyToClipboard(text)
  }

  return (
    <div className={`${messageBackground} flex flex-col rounded-lg border-border border rounded-t-none`}>
      <div className='flex items-center justify-end gap-2 bg-tertiary py-0.5 pr-2'>
        {type ? <Badge className={typeBadgeBackground}>{type}</Badge> : null}
        <Badge className={isUser ? 'bg-badge-user' : 'bg-badge-ai'}>{isUser ? userRoleText : aiRoleText}</Badge>
        <button
          className='group flex cursor-pointer justify-center p-2 hover:bg-tertiary-hover disabled:cursor-not-allowed'
          onClick={handleCopy}
        >
          <AccessibleIcon label={copyText}>
            <Copy className='size-4 fill-primary group-disabled:fill-disabled group-hover:fill-primary-hover' />
          </AccessibleIcon>
        </button>
      </div>
      <div className='break-words rounded-b-md p-2'>
        <Markdown options={{ disableParsingRawHTML: true }}>{text}</Markdown>
      </div>
    </div>
  )
}
