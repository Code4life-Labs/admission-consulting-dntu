import { PromptTemplate } from 'langchain/prompts'
import { getModelOpenAI } from './utils/get_llm'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnableSequence } from '@langchain/core/runnables'
import { getChatHistoryConvertString } from './utils/upstash_chat_history'


export const getClassificationResult = async (sessionId, question) => {
  const promptTemplate = PromptTemplate.fromTemplate(`

  Regarding the user question below, please classify it as about \`ANSWER_NORMAL\`,\`SEARCH_INTERNET\`,\`SEARCH_JOB\`.
  Based on question and chat history:
  if question is related to CHAT HISTORY return "ANSWER_NORMAL",
  if else question is related to FINDING JOBS FOR USER return "SEARCH_JOB" (When Only user queries about current opening jobs that the system has at the moment . Example: Are there any React web developer intern jobs?. Move on to the next condition if this condition is not met!), 
  if else question is related to KNOWLEDGE return "SEARCH_INTERNET"
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