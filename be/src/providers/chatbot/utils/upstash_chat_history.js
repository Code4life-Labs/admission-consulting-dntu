import { env } from '../../../config/environment'
import { UpstashRedisChatMessageHistory } from '@langchain/community/stores/message/upstash_redis'
import { getConvertChatHistory } from './convert_chat_history'
import { AIMessage, HumanMessage } from '@langchain/core/messages'
import { Redis } from '@upstash/redis'


export const getChatHistoryBasic = async (sessionId) => {
  try {
    const client = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN
    })

    client.del()

    const upstashChatHistory = new UpstashRedisChatMessageHistory({
      sessionId,
      config: {
        url: env.UPSTASH_REDIS_REST_URL || '',
        token: env.UPSTASH_REDIS_REST_TOKEN || ''
      }
    })
    const basicChatHistory = await upstashChatHistory.getMessages()
    return basicChatHistory
  } catch (error) {
    throw new Error(error)
  }
}

export const getChatHistoryConvertString = async (sessionId) => {
  try {
    const basicChatHistory = await getChatHistoryBasic(sessionId)
    return getConvertChatHistory(basicChatHistory.splice(-5))
  } catch (error) {
    throw new Error(error)
  }
}

export const addChatHistory = async (sessionId, input, response) => {
  try {
    const upstashChatHistory = new UpstashRedisChatMessageHistory({
      sessionId,
      config: {
        url: env.UPSTASH_REDIS_REST_URL || '',
        token: env.UPSTASH_REDIS_REST_TOKEN || ''
      }
    })
    const result = await upstashChatHistory.addMessages([new HumanMessage(input), new AIMessage(response)])
    // console.log("🚀 ~ addChatHistory ~ result:", result)
  } catch (error) {
    throw new Error(error)
  }
}


