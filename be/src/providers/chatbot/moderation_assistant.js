import { moderationDeteched, moderationDetechedMd } from './utils/prompt'
import { PromptTemplate } from '@langchain/core/prompts'
import { RunnableSequence } from '@langchain/core/runnables'
import { getModelOpenAI } from './utils/get_llm'
import { StringOutputParser } from '@langchain/core/output_parsers'
import { badWords } from 'vn-badwords'


export async function getAnswerModerationAssistant(dataGetAnswer) {

  const { sessionId, question, user_name, io, socketIdMap, type, emitId } = dataGetAnswer

  // Check bad word
  const checkBadWords = badWords(question, { validate: true })
  console.log('🚀 ~ getAnswerModerationAssistant ~ checkBadWords:', checkBadWords)
  if (checkBadWords) {
    if (type === 'STREAMING') {
      io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
        responseObj: {
          content: moderationDetechedMd,
          type: 'answer'
        }
      })
      return moderationDetechedMd
    } else return moderationDeteched
  }

  const promptTemplate = PromptTemplate.fromTemplate(`
  Regarding the user question below, please classify it as about \`SAFE\`,\`UNSAFE\`.
  Based on question:
  if question is related to sensitive content, threats, harassment, pornography, and attacks on individuals and organizations return "UNSAFE",
  if not return "SAFE"
  Do not respond with more than one word.

  <question>
  {question}
  </question>

  Classification:`)

  const classificationChain = RunnableSequence.from([
    promptTemplate,
    getModelOpenAI(),
    new StringOutputParser()
  ])

  const respone = await classificationChain.invoke({
    question
  })

  console.log('🤖 data deteched:', respone)

  if (type === 'STREAMING') {
    if (respone === 'UNSAFE') {
      io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
        responseObj: {
          content: moderationDetechedMd,
          type: 'answer'
        }
      })
      return moderationDetechedMd
    } else return ''
  } else if (respone === 'UNSAFE') return moderationDeteched
  else return ''
}