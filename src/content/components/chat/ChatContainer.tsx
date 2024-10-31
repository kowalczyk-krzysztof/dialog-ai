import { ConversationContainer } from './conversation/ConversationContainer'
import { QuickActionContainer } from './quick-action/QuickActionContainer'
import { UserInputContainer } from './user-input/UserInputContainer'

export const ChatContainer = () => (
  <>
    <ConversationContainer />
    <QuickActionContainer />
    <UserInputContainer />
  </>
)
