import { getChatHistoryConvertString } from './utils/upstash_chat_history'
import OpenAI from 'openai'
import { env } from '../../config/environment'
import { getVectorStoreSupabase } from './utils/retriever'
import { promptRole } from './utils/prompt'
import { getModelOptional } from './utils/get_llm'

export const getAnswerDocumentAssistant = async (dataGetAnswer) => {
  const { sessionId, standaloneQuestion, question, user_name, io, socketIdMap, type, model='gpt-3.5-turbo-1106', emitId } = dataGetAnswer
  console.log('🚀 ~ getAnswerDocumentAssistant ~ type:', type)

  // get vector
  const vectorStoreSupabase = await getVectorStoreSupabase()
  const vectorResults = await vectorStoreSupabase.similaritySearchWithScore(standaloneQuestion, 3)
  console.log('🚀 ~ getAnswerDocumentAssistant ~ vectorResults:', vectorResults)
  const vectorThresholds = vectorResults.filter(vector => vector[1] >= 0.86)
  console.log('🚀 ~ getAnswerDocumentAssistant ~ vectorThresholds:', vectorThresholds)

  if (vectorThresholds.length === 0) {
    return 'NO_ANSWER'
  }

  const sourcesResult = []
  vectorThresholds.forEach(vectorThreshold => {
    const metadataId = vectorThreshold[0].metadata?.id
    const existId = sourcesResult.find(s => s.id === metadataId)
    if (!existId) sourcesResult.push(vectorThreshold[0].metadata)
  })
  console.log('🚀 ~ getAnswerDocumentAssistant ~ sourcesResult:', sourcesResult)
  if (type === 'STREAMING') {
    io.to(socketIdMap[sessionId]).emit(`s_create_relevant_info_${emitId}`, {
      type: 'related_content',
      sourcesResult: sourcesResult
    })
  }

  const openai = getModelOptional(model)

  let chat_history = await getChatHistoryConvertString(sessionId)
  chat_history += '\nHuman: ' + question

  const dataChatchatCompletion = {
    messages: [
      {
        role: 'system',
        // - Don't try to make up an answer. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." then direct the questioner to email tuyensinh@dntu.edu.vn to assist.
        content: `${promptRole}
        Please answer the question, and make sure you follow ALL of the rules below:
        - Here is query: ${question}, respond back with an answer for user is as long as possible. You can based on history chat that human provided below
        ${user_name ? '- Please mention the user\'s name when chatting. The user\'s name is' + user_name : ''}
        - Answer questions in a helpful manner that straight to the point, with clear structure & all relevant information that might help users answer the question
        - Don't answer in letter form, don't be too formal, try to answer normal chat text type as if you were chatting to a friend. You can use icons to show the friendliness
        ${type === 'STREAMING' ? '- Anwser should be formatted in Markdown (IMPORTANT) \n- Please prioritize IMAGES, VIDEO, LINKS, TABLE in markdown syntax (IMPORTANT), If there are relevant markdown syntax have type: IMAGES, VIDEO, LINKS, TABLE, CODE, ... You must include them as part of the answer and must keep the markdown syntax'
    : '- Please return an answer in plain text NOT MARKDOWN SYNTAX'}
        - Please answer in VIETNAMESE. Double check the spelling to see if it is correct whether you returned the answer in Vietnamese
        ${type !== 'STREAMING' ? '- Return the sources used in the response with iterable numbered style.' : ''}
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
        content:  `(VIETNAMESE ANSWER ${type === 'STREAMING' ? 'FORMATTED IN MARKDOWN' : 'FORMATTED IN PLAIN TEXT'})`
      }
    ],
    model
  }

  if (type === 'STREAMING') dataChatchatCompletion.stream = true
  const chatCompletion = await openai.chat.completions.create(dataChatchatCompletion)

  console.log('11. Sent content to Groq for chat completion.')
  let messageReturn = ''
  console.log('12. Streaming (or Not Streaming) response from Groq... \n')

  if (type === 'STREAMING') {
    // mỗi 100 mili giây nó trả về một lần đến khi kết thúc
    // const intervalId = setInterval(() => {

    //   io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
    //     responseObj: {
    //       content: messageReturn,
    //       type: 'answer'
    //     }
    //   })
    // }, 100)
    for await (const chunk of chatCompletion) {
      if (chunk.choices[0].delta && chunk.choices[0].finish_reason !== 'stop') {
        process.stdout.write(chunk.choices[0].delta.content)
        messageReturn += chunk.choices[0].delta.content
        io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
          responseObj: {
            content: messageReturn,
            type: 'answer'
          }
        })
      } else {
        io.to(socketIdMap[sessionId]).emit(`s_create_answer_${emitId}`, {
          responseObj: {
            content: messageReturn,
            type: 'answer'
          }
        })
        // clearInterval(intervalId)
        // console.log('🚀 ~ forawait ~ messageReturn:', messageReturn)

        return messageReturn
      }
    }
  } else {
    console.log('🚀 ~ getAnswerNormalAssistant ~ chatCompletion:', chatCompletion?.choices[0]?.message?.content)
    return chatCompletion?.choices[0]?.message?.content
  }
}