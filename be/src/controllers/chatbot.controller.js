import { HttpStatusCode } from '../utilities/constants'
import { ChatbotService } from '../services/chatbot.service'

const uploadMultiDocsWebsite = async (req, res) => {
  console.log('🚀 ~ file: chatbot.controller.js:5 ~ uploadMultiDocsWebsite ~ req:', req.body)
  try {
    const result = await ChatbotService.uploadMultiDocsWebsite(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const uploadMultiDocs = async (req, res) => {
  try {
    const result = await ChatbotService.uploadMultiDocs(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const testScratchWebsite = async (req, res) => {
  try {
    const result = await ChatbotService.testScratchWebsite(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

const uploadSingleDocMD = async (req, res) => {
  try {
    const result = await ChatbotService.uploadSingleDocMD(req.body)
    res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}
export const ChatbotController = {
  uploadMultiDocsWebsite,
  uploadMultiDocs,
  testScratchWebsite,
  uploadSingleDocMD
}
