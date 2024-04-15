import express from 'express'

// Import from controllers
import { ChatbotController } from '../../controllers/chatbot.controller'

// Import from validations
import { ChatbotValidation } from '../../validations/chatbot.validation'

// Import from utils

const router = express.Router()

router.route('/upload_multi_docs_website')
  .post(ChatbotValidation.uploadMultiDocsWebsite, ChatbotController.uploadMultiDocsWebsite)

router.route('/upload_multi_docs_local')
  .post(ChatbotValidation.uploadMultiDocs, ChatbotController.uploadMultiDocs)

router.route('/test_scratch_website')
  // .post(ChatbotValidation.testScratchWebsite, ChatbotController.testScratchWebsite)
  .post(ChatbotController.testScratchWebsite)

router.route('/upload_single_doc_md')
  // .post(ChatbotValidation.testScratchWebsite, ChatbotController.testScratchWebsite)
  .post(ChatbotController.uploadSingleDocMD)

export const chatbotRoutes = router
