import express from 'express'


// Import from controllers
import { ChatbotController } from '../../controllers/chatbot.controller'

// Import from validations
import { ChatbotValidation } from '../../validations/chatbot.validation'
import { env } from '../../config/environment'
import { HttpStatusCode } from '../../utilities/constants'
import { FPTController } from '../../controllers/fptbot.controller'

// Import from utils

const router = express.Router()

// FPT BOT
router
  .route('/answer-text')
  .get(function(req, res) {
    try {
      if (req.query.token !== env.FPT_WEBHOOK_TOKEN) {
        return res.status(HttpStatusCode.UNAUTHORIZED).json({
          errors: 'Invalid token'
        })
      }

      return res.status(HttpStatusCode.OK).send(env.FPT_WEBHOOK_TOKEN)
    } catch (error) {
      return res.status(HttpStatusCode.INTERNAL_SERVER).json({
        errors: error.message
      })
    }
  })

router
  .route('/answer-text')
  .post(
    function(req, res, next) {
      try {
        if (req.query.token !== env.FPT_WEBHOOK_TOKEN) {
          return res.status(HttpStatusCode.UNAUTHORIZED).json({
            errors: 'Invalid token'
          })
        }

        return next()
      } catch (error) {
        return res.status(HttpStatusCode.INTERNAL_SERVER).json({
          errors: error.message
        })
      }
    },
    FPTController.getAnswer
  )

router
  .route('/get-answer-ai')
  .post(FPTController.getAnswerAI)

router
  .route('/save-chat-history')
  .post(FPTController.saveChatHistory)

export const fptbotRoutes = router