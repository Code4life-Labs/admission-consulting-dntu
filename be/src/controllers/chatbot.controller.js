import { HttpStatusCode } from '../utilities/constants'
import { ChatbotService } from '../services/chatbot.service'

const getText = async (req, res) => {
  console.log('🚀 ~ file: chatbot.controller.js:5 ~ getText ~ req:', req.body)
  try {
    const result = await ChatbotService.getText(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const ChatbotController = {
  getText
}
