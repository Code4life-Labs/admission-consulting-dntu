/* eslint-disable no-unreachable */

const getText = async (data) => {
  console.log('🚀 ~ file: chatbot.service.js:4 ~ getText ~ data:', data)
  try {
    return {
      textReturned: data.text
    }
  } catch (error) {
    throw new Error(error)
  }
}

export const ChatbotService = {
  getText
}
