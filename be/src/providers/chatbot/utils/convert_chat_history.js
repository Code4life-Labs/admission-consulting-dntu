import { HumanMessage } from '@langchain/core/messages'

export function getConvertChatHistory(messages) {
  const fullChatHistory = messages.map((message) => {
    if (message instanceof HumanMessage) {
      return `Human: ${message.content}`
    } else {
      return `AI: ${message.content}`
    }
  }).join('\n')
  return fullChatHistory
}
