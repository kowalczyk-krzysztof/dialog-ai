import { forwardRef, Ref, type Dispatch, type SetStateAction } from 'react'
import type { Conversation } from '../../../types/types'
import { SendPromptButton } from './SendPromptButton'
import * as ScrollArea from '@radix-ui/react-scroll-area'

interface Props {
  userInput: string
  disabled: boolean
  setUserInput: Dispatch<SetStateAction<string>>
  setConversation: Dispatch<SetStateAction<Conversation>>
}
// FIXME: Fix textarea not being clickable after losing focus
export const UserInputContainer = forwardRef<HTMLTextAreaElement, Props>(
  ({ userInput, disabled, setUserInput, setConversation }, ref: Ref<HTMLTextAreaElement>) => (
    <div className='mt-2 flex h-52 w-full items-center rounded-lg bg-gray-50 px-3 py-2 dark:bg-gray-700'>
      <ScrollArea.Root className='size-full'>
        <ScrollArea.Viewport className='size-full'>
          <textarea
            ref={ref}
            value={userInput}
            onChange={e => setUserInput(e.target.value)}
            // disabled={disabled} TODO: Fix disabled logic
            className='size-full resize-none overflow-hidden rounded-lg bg-neutral-600 p-2 text-sm'
          />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation='vertical'>
          <ScrollArea.Thumb />
        </ScrollArea.Scrollbar>
        <ScrollArea.Corner />
      </ScrollArea.Root>
      <SendPromptButton
        userInput={userInput}
        setUserInput={setUserInput}
        disabled={disabled}
        setConversation={setConversation}
      />
    </div>
  )
)

UserInputContainer.displayName = 'UserInputContainer'
