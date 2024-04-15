import express from 'express'


// Import from routes
import { chatbotRoutes } from './chatbot.route'
import { webhookRoutes } from './webhook.route'
import { fptbotRoutes } from './fptbot.route'
import { speechRoutes } from './speech.route'
import { HttpStatusCode } from '../../utilities/constants'

const router = express.Router()

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

// Chat bot
router.use('/chatbot', chatbotRoutes)

// Fpt bot
router.use('/fpt', fptbotRoutes)

// Speech
router.use('/speech', speechRoutes)

router.use(webhookRoutes)

export const apiV1 = router
