import express from 'express'

// Import from controllers
import { SpeechController } from '~/controllers/speech.controller'
import { OpenAISpeechController } from '~/controllers/openai_speech.controller'


const router = express.Router()

router
  .route('/')
  .get(SpeechController.getSpeechByText)

router
  .route('/')
  .post(SpeechController.createSpeech)

router
  .route('/openai')
  .post(OpenAISpeechController.getSpeechByText)

export const speechRoutes = router