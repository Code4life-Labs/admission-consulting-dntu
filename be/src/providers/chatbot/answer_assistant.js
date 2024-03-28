import { ChatPromptTemplate, MessagesPlaceholder } from 'langchain/prompts'
import { getModelLlm, getModelOpenAI } from './utils/get_llm'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnablePassthrough, RunnableSequence, RunnableBranch } from '@langchain/core/runnables'
import { ParamsFromFString } from '@langchain/core/prompts'
import { promptRole } from './utils/prompt'
import { addChatHistory, getChatHistoryConvertString } from './utils/upstash_chat_history'

// const promptTemplate = ChatPromptTemplate.fromTemplate(`${promptRole}
//       Please just use the conversation history to see if you can reply from there. If possible, please answer in Tiếng Việt (IMPORTANT).
//       Avoid fabricating an answer. Always speak as if you're chatting with a friend. Remember to mention the user's name when chatting. The user's name is {user_name}.
//       If you are really unsure about the correctness of your answer, return "SEARCH INTERNET" for search engine use.
//       Note that if the user asks a question about the KNOWLEDGE, "SEARCH_INTERNET" is returned immediately.
//       Note that if the user asks a question about the SEEKING JOB, "SEARCH_DATABASE" is returned immediately.

//       <chat_history>
//       {chat_history}
//       </chat_history>

//       <question>
//       {question}
//       </question>

//       Answer:`);

export const getAnswerNormalAssistant = async (sessionId, question, user_name) => {
  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system', `${promptRole}
      - Here is query: {question}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
      - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email softseekservice@gmail.com to assist. 
      - Always speak as if you were chatting to a friend. 
      - Please mention the user's name when chatting. The user's name is {user_name}
      - Please answer in VIETNAMESE
    `],
    ['system', 'History chat: {chat_history}'],
    ['system', 'Answer: ']
  ])

  const chain = RunnableSequence.from([
    promptTemplate,
    getModelOpenAI(),
    new StringOutputParser()
  ])

  let chat_history = await getChatHistoryConvertString(sessionId)
  chat_history += 'Human: ' + question

  const respone = await chain.invoke({
    user_name,
    chat_history,
    question
  })
  return respone
}