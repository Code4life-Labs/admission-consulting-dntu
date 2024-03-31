import { getChatHistoryConvertString } from './utils/upstash_chat_history'
import OpenAI from 'openai'
import { env } from '../../config/environment'


// export const getStandaloneQuestion = async (sessionId: string, question: string) => {
//   const standaloneQuestionTemplate = `
//   You are a rephraser and always respond with a rephrased VIETNAMESE version of the input that is given to a search engine API. Always be succint and use the same words as the input. RETURN ONLY A REVISED VIETNAMESE VERSION OF THE INPUT AND ADD NO MORE SENTENCES.
//   Given some conversation history (if any) and a question, convert the question to a standalone question.
//   Conversation history: {chat_history}
//   Question: {question}
//   Standalone question in Vietnamese:`

//   const chain = RunnableSequence.from([
//     PromptTemplate.fromTemplate(standaloneQuestionTemplate),
//     getModelOpenAI(),
//     new StringOutputParser(),
//   ]);
//   const chat_history = await getChatHistoryConvertString(sessionId);

//   const respone = await chain.invoke({
//     chat_history,
//     question
//   });
//   return respone;
// }

export const getStandaloneQuestion = async (sessionId, question) => {
  const openai = new OpenAI({ apiKey: env.OPENAI_API_KEY })
  let chat_history = await getChatHistoryConvertString(sessionId)
  chat_history += '\nHuman: ' + question

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: `
        - You are a rephraser and always respond with a rephrased VIETNAMESE version of the input and the chat history that is given to a search engine API. 
        - From user text and chat history, convert it into search engine optimized language. Always keep the full gist of the search engine API.
        - Conversation history: ${chat_history}
        - Based on the previous conversation history and the current question, infer and synthesize it into a meaningful complete question.
        Please create an meaningful string question using JSON in Vietnamese.
        The JSON schema should include {
          "question": "Meaningful Question in Vietnamese"
        }
        - 
        `
      },
      {
        role: 'user',
        content: `Question: ${question}`
      },
      {
        role: 'assistant',
        content: '(JSON schemma answer)'
      }
    ],
    model: 'gpt-3.5-turbo-0125',
    temperature: 0
  })

  const result = JSON.parse(response.choices[0].message.content ?? '')
  return result?.question
}