import express from 'express'
import { ChatbotController } from '../../controllers/chatbot.controller'
import { ChatbotValidation } from '../../validations/chatbot.validation'

const router = express.Router()

router.route('/get-text')
  .post(ChatbotController.getText)

export const chatbotRoutes = router
