import OpenAI from 'openai'
import { env } from '~/config/environment'

const openai = new OpenAI({
  apiKey: env.CHATGPT_API_KEY
})

const textGeneration = async (queryText) => {
  console.log('🚀 ~ file: ChatGptProvider.js:5 ~ textGeneration ~ queryText:', queryText)
  try {

    // cái này sẽ tốn tg nhiều hơn model
    // const response = await openai.chat.completions.create({
    //   model: 'gpt-3.5-turbo',
    //   messages: [
    //     {
    //       role: 'system',
    //       content: 'Như là một người trợ lý tạo văn bản cho chatbot hỗ trợ dịch thuật tôi có hai biến textInitial và textTranslated tôi muốn bạn hãy giúp tạo ra đoạn văn bản để trả về cho người dùng'
    //     },
    //     {
    //       role: 'user',
    //       content: 'textInitial="Hello", textTranslated="Xin Chào"'
    //     },
    //     {
    //       role: 'system',
    //       content: 'Từ Tiếng Anh "Hello" có nghĩa là "Xin chào" trong Tiếng Việt'
    //     },
    //     {
    //       role: 'user',
    //       content: queryText
    //     }
    //   ],
    //   temperature: 0.2,
    //   max_tokens: 1500,
    //   top_p: 1,
    //   frequency_penalty: 0,
    //   presence_penalty: 0
    // })

    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Human: textInitial="Hello", textTranslated="Xin Chào" \nChatbot: Từ Tiếng Anh "Hello" có nghĩa là "Xin chào" trong Tiếng Việt \nHuman: ${queryText} \nChatbot: `,
      temperature: 0.1,
      max_tokens: 3500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: ['Human:', 'AI:']
    })
    console.log('🚀 ~ file: ChatGptProvider.js:49 ~ textGeneration ~ response:', response)

    return {
      isSuccess: true,
      response: `${response.choices[0].text}`.trimStart()
    }

  } catch (error) {
    console.log('🚀 ~ file: ChatGptProvider.js:45 ~ textGeneration ~ error:', error)
    return {
      isSuccess: false,
      response: 'Có lỗi trong quá trình gọi đến chatgpt'
    }
  }
}

const translateText = async (queryText) => {
  try {
    const response = await openai.completions.create({
      model: 'text-davinci-003',
      prompt: `Human: text="Hello",languageConvert="vietnamese" \nChatbot: "Xin chào" \nHuman: text="Những con chó",languageConvert="english" \nChatbot: "Dogs" trong Tiếng Việt \nHuman: ${queryText} \nChatbot: `,
      temperature: 0.1,
      max_tokens: 3500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
      stop: ['Human:', 'AI:']
    })
    console.log('🚀 ~ file: ChatGptProvider.js:49 ~ textGeneration ~ response:', response)

    return {
      isSuccess: true,
      response: `${response.choices[0].text}`.trimStart()
    }

  } catch (error) {
    console.log('🚀 ~ file: ChatGptProvider.js:45 ~ textGeneration ~ error:', error)
    return {
      isSuccess: false,
      response: 'Xin lỗi đã có vấn trong quá trình gọi đến server!'
    }
  }
}

export const ChatGptProvider = {
  textGeneration,
  translateText
}