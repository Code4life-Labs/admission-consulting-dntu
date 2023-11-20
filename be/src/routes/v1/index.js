import express from 'express'

import { chatbotRoutes } from './chatbot.route'
import { HttpStatusCode } from '~/utilities/constants'

const router = express.Router()

router.get('/status', (req, res) => res.status(HttpStatusCode.OK).json({ status: 'OK!' }))

/** Chat APIs */
router.use('/chatbot', chatbotRoutes)

export const apiV1 = router
