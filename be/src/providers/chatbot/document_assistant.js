import { getChatHistoryConvertString } from './utils/upstash_chat_history'
import OpenAI from 'openai'
import { env } from '../../config/environment'
import { getVectorStoreSupabase } from './utils/retriever'
import { promptRole } from './utils/prompt'

export const getAnswerDocumentAssistant = async (dataGetAnswer) => {
  const { sessionId, standaloneQuestion, question, user_name, io, socketIdMap, type } = dataGetAnswer
  // get vector
  const vectorStoreSupabase = await getVectorStoreSupabase()
  const vectorResults = await vectorStoreSupabase.similaritySearchWithScore(standaloneQuestion, 5)
  console.log('🚀 ~ getAnswerDocumentAssistant ~ vectorResults:', vectorResults)
  const vectorThresholds = vectorResults.filter(vector => vector[1] >= 0.85)
  console.log('🚀 ~ getAnswerDocumentAssistant ~ vectorThresholds:', vectorThresholds)

  if (vectorThresholds.length === 0) {
    return 'NO_ANSWER'
  }

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
        ${user_name ? '- Please mention the user\'s name when chatting. The user\'s name is' + user_name : ''}
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
        role: 'user',
        content: ` - Here are the top results from a similarity search: ${JSON.stringify(vectorThresholds)}. `
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
          type: 'answer'
        }
      })
    }, 100)
    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== 'stop') {
        process.stdout.write(chunk.choices[0].delta.content)
        messageReturn += chunk.choices[0].delta.content
      } else {
        io.to(socketIdMap[sessionId]).emit('s_create_answer', {
          responseObj: {
            content: messageReturn,
            type: 'answer'
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