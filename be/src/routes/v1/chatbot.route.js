import express from 'express'
import { ChatbotController } from '../../controllers/chatbot.controller'
import { ChatbotValidation } from '../../validations/chatbot.validation'

const router = express.Router()

router.route('/consult')
  .post(ChatbotValidation.getTextConsulting, ChatbotController.getTextConsulting)

// Được sử dụng để cho dự án cô Thi
router.route('/generate-text-gpt')
  .post(ChatbotValidation.generateTextGPT, ChatbotController.generateTextGPT)

router.route('/translate-text-gpt')
  .post(ChatbotValidation.translateTextGPT, ChatbotController.translateTextGPT)

export const chatbotRoutes = router
