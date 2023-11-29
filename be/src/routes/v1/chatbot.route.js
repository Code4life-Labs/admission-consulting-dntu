import express from 'express'

// Import from env
import { env } from '~/config/environment'

// Import from controllers
import { ChatbotController } from '../../controllers/chatbot.controller'
import { FPTController } from '~/controllers/fptbot.controller'

// Import from validations
import { ChatbotValidation } from '../../validations/chatbot.validation'

// Import from utils
import { HttpStatusCode } from '~/utilities/constants'

const router = express.Router()

router.route('/consult')
  .post(ChatbotValidation.getTextConsulting, ChatbotController.getTextConsulting)

// Được sử dụng để cho dự án cô Thi
router.route('/generate-text-gpt')
  .post(ChatbotValidation.generateTextGPT, ChatbotController.generateTextGPT)

export const chatbotRoutes = router
