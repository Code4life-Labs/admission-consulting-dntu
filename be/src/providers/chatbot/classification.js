import { PromptTemplate } from '@langchain/core/prompts'
import { getModelOpenAI } from './utils/get_llm'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { RunnableSequence } from '@langchain/core/runnables'
import { getChatHistoryConvertString } from './utils/upstash_chat_history'


export const getClassificationResult = async (sessionId, question) => {
  const promptTemplate = PromptTemplate.fromTemplate(`
  Regarding the user question below, please classify it as about \`ANSWER_NORMAL\`,\`SEARCH_DOCUMENT\`,\`SEARCH_JOB\`.
  Based on question and chat history:
  if question is related to CHAT HISTORY return "ANSWER_NORMAL",
  if else question is related to KNOWLEDGE return "SEARCH_DOCUMENT"
  Do not respond with more than one word.

  <chat_history>
  {chat_history}
  </chat_history>
  
  <question>
  {question}
  </question>

  Classification:`)

  const classificationChain = RunnableSequence.from([
    promptTemplate,
    getModelOpenAI(),
    new StringOutputParser()
  ])
  const chat_history = await getChatHistoryConvertString(sessionId)

  const respone = await classificationChain.invoke({
    chat_history,
    question
  })
  return respone
}