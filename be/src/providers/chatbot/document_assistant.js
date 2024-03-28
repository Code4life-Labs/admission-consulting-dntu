import { getChatHistoryConvertString } from './utils/upstash_chat_history'
import OpenAI from 'openai'
import { env } from '../../config/environment'
import { getVectorStoreSupabase } from './utils/retriever'
import { promptRole } from './utils/prompt'

export const getAnswerDocumentAssistant = async (sessionId, question, origin_message, user_name) => {
  // get vector
  const vectorStoreSupabase = await getVectorStoreSupabase()
  const vectorResults = await vectorStoreSupabase.similaritySearchWithScore(question, 3)
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
  chat_history += '\nHuman: ' + origin_message

  const chatCompletion = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `${promptRole}
        - Here is query: ${origin_message}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
        - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email tuyensinh@dntu.edu.vn to assist. 
        - Always speak as if you were chatting to a friend. 
        - Please mention the user's name when chatting. The user's name is ${user_name}
        - Please answer in VIETNAMESE
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
        content:  '(Vietnamese answer)'
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