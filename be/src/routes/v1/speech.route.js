import express from 'express'

// Import from controllers
import { SpeechController } from '~/controllers/speech.controller'


const router = express.Router()

router
  .route('/')
  .get(SpeechController.getSpeechByText)

router
  .route('/')
  .post(SpeechController.createSpeech)

export const speechRoutes = router