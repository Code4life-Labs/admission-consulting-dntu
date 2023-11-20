import { HttpStatusCode } from '../utilities/constants'
import { ChatbotService } from '../services/chatbot.service'

const getTextConsulting = async (req, res) => {
  console.log('🚀 ~ file: chatbot.controller.js:5 ~ getTextConsulting ~ req:', req.body)
  try {
    const result = await ChatbotService.getTextConsulting(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const generateTextGPT = async (req, res) => {
  try {
    const result = await ChatbotService.generateTextGPT(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const translateTextGPT = async (req, res) => {
  try {
    const result = await ChatbotService.translateTextGPT(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const ChatbotController = {
  getTextConsulting,
  generateTextGPT,
  translateTextGPT
}
