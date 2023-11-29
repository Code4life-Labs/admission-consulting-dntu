import express from 'express'

// Import from config
import { env } from '~/config/environment'

// Import from utils
import { HttpStatusCode } from '~/utilities/constants'

const router = express.Router()

router
  .route('/')
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
  .route('/')
  .post(function(req, res) {
    try {
      const token = req.body.token

      if (token !== env.FPT_WEBHOOK_TOKEN) {
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

export const webhookRoutes = router