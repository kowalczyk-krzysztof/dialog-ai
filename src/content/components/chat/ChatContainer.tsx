import { ConversationContainer } from './conversation/ConversationContainer'
import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './user-input/UserInputContainer'

interface Props {
  isSettingsViewOpen: boolean
}

export const ChatContainer = ({ isSettingsViewOpen }: Props) => (
  <section className={isSettingsViewOpen ? 'hidden' : 'flex h-full flex-col items-center gap-2 px-4 pt-2'}>
    <ConversationContainer />
    <QuickActionContainer />
    <UserInputContainer />
  </section>
)
