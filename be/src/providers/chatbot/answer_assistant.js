import { ChatPromptTemplate } from '@langchain/core/prompts'
import { getModelOpenAI } from './utils/get_llm'
import { StringOutputParser } from 'langchain/schema/output_parser'
import { RunnableSequence } from '@langchain/core/runnables'
import { promptRole } from './utils/prompt'
import { getChatHistoryConvertString } from './utils/upstash_chat_history'
import { env } from '../../config/environment'
import OpenAI from 'openai'


export const getAnswerNormalAssistant = async (dataGetAnswer) => {
  console.log('🚀 ~ getAnswerNormalAssistant ~ dataGetAnswer:', dataGetAnswer)
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
  const { sessionId, question, user_name, io, socketIdMap, type } = dataGetAnswer

  const openai = new OpenAI({
    baseURL: 'https://api.groq.com/openai/v1',
    apiKey: env.GROQ_API_KEY
  })

  let chat_history = await getChatHistoryConvertString(sessionId)
  chat_history += '\nHuman: ' + question
  const dataChatchatCompletion = {
    messages: [
      {
        role: 'system',
        content: `${promptRole}
            - Here is query: ${question}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
            - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email tuyensinh@dntu.edu.vn to assist. 
            ${user_name ? '- Please mention the user\'s name when chatting. The user\'s name is ' + user_name : ''}
            - Please answer directly to the point of the question, avoid rambling
            - Don't answer in letter form, don't be too formal, try to answer normal chat text type as if you were chatting to a friend. You can use icons to show the friendliness
            - Please answer in VIETNAMESE. Double check 1.the spelling to see if it is correct 2. whether you returned the answer in Vietnamese
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
    model: 'mixtral-8x7b-32768'
  }

  if (type === 'STREAMING') dataChatchatCompletion.stream = true
  const chatCompletion = await openai.chat.completions.create(dataChatchatCompletion)


  console.log('11. Sent content to Groq for chat completion.')
  let messageReturn = ''
  console.log('12. Streaming (or Not Streaming) response from Groq... \n')

  if (type === 'STREAMING') {
    // mỗi 100 mili giây nó trả về một lần đến khi kết thúc
    const intervalId = setInterval(() => {

      io.to(socketIdMap[sessionId]).emit('s_create_answer', {
        responseObj: {
          content: messageReturn,
          type: 'anwser'
        }
      })
    }, 100)
    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== 'stop') {
        process.stdout.write(chunk.choices[0].delta.content)
        messageReturn += chunk.choices[0].delta.content
      } else {
        io.to(socketIdMap[sessionId]).emit('s_create_answer', {
          isOver: 'DONE',
          responseObj: {
            content: messageReturn,
            type: 'anwser'
          }
        })
        clearInterval(intervalId)
        // console.log('🚀 ~ forawait ~ messageReturn:', messageReturn)

        return messageReturn
      }
    }
  } else {
    console.log('🚀 ~ getAnswerNormalAssistant ~ chatCompletion:', chatCompletion?.choices[0]?.message?.content)
    return chatCompletion?.choices[0]?.message?.content
  }
}