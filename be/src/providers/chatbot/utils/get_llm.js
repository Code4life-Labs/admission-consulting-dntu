import { ChatOpenAI } from '@langchain/openai'
import { ChatGroq } from '@langchain/groq'

export const getModelOpenAI = () => {
  return new ChatOpenAI({ modelName: 'gpt-3.5-turbo-0125', temperature: 0 })
}


export const getModelLlama = () => {
  const openai = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY
  })
  return openai
}

export const getModelLlm = () => {
  const openai = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY
  })
  return openai
}