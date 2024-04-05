import { ChatOpenAI } from '@langchain/openai'
import { ChatGroq } from '@langchain/groq'
import OpenAI from 'openai'
import { env } from '~/config/environment'

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

export const getModelOptional = (model) => {
  if (['gpt-3.5-turbo-0125', 'gpt-3.5-turbo-1106'].includes(model)) {
    console.log('Return model normal')
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  } else if (['llama2-70b-4096', 'mixtral-8x7b-32768', 'gemma-7b-it'].includes(model)) {
    console.log('Return model fast')
    return new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY
    })
  } else {
    console.log('Return model fast cause model undifined')
    return new OpenAI({
      baseURL: 'https://api.groq.com/openai/v1',
      apiKey: process.env.GROQ_API_KEY
    })
  }
}