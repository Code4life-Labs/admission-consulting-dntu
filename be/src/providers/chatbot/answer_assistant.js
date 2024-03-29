import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelOpenAI } from './utils/get_llm'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnableSequence } from '@langchain/core/runnables'
import { promptRole } from './utils/prompt'
import { getChatHistoryConvertString } from './utils/upstash_chat_history'
import { env } from '../../config/environment'
import OpenAI from 'openai'


export const getAnswerNormalAssistant = async (sessionId, question, user_name) => {
  // const promptTemplate = ChatPromptTemplate.fromMessages([
  //   ['system', `${promptRole}
  //     - Here is query: {question}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
  //     - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email tuyensinh@dntu.edu.vn to assist.
  //     - Always speak as if you were chatting to a friend.
  //     - Please mention the user's name when chatting. The user's name is {user_name}
  //     - Please answer in VIETNAMESE
  //   `],
  //   ['system', 'History chat: {chat_history}'],
  //   ['system', 'Answer: ']
  // ])

  // const chain = RunnableSequence.from([
  //   promptTemplate,
  //   getModelOpenAI(),
  //   new StringOutputParser()
  // ])

  // let chat_history = await getChatHistoryConvertString(sessionId)
  // chat_history += 'Human: ' + question

  // const respone = await chain.invoke({
  //   user_name,
  //   chat_history,
  //   question
  // })
  // return respone
  const openai = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: env.GROQ_API_KEY
  })

  let chat_history = await getChatHistoryConvertString(sessionId)
  chat_history += '\nHuman: ' + question

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `${promptRole}
            - Here is query: {question}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
            - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email tuyensinh@dntu.edu.vn to assist. 
            - Please mention the user's name when chatting. The user's name is ${user_name}
            - Please answer directly to the point of the question, avoid rambling
            - Don't answer in letter form, don't be too formal, try to answer normal chat text type as if you were chatting to a friend. You can use icons to show the friendliness
            - Please answer in VIETNAMESE. Double check the spelling to see if it is correct
          `
      },
      {
        role: 'user',
        content:  `History chat: ${chat_history}`
      },
      {
        role: 'assistant',
        content:  '(vietnamese answer)'
      }
    ],
    stream: true,
    model: 'mixtral-8x7b-32768'
  })
  console.log('11. Sent content to Groq for chat completion.')
  let responseTotal = ''
  console.log('12. Streaming response from Groq... \n')
  for await (const chunk of chatCompletion) {
    if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== 'stop') {
      // process.stdout.write(chunk.choices[0].delta.content);
      responseTotal += chunk.choices[0].delta.content
    } else {
      console.log('🚀 ~ forawait ~ responseTotal:', responseTotal)
      return responseTotal
    }
  }
}