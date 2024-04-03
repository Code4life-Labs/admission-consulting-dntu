import { Request, Response } from 'express'

// Import from models
import { SpeechModel } from '~/models/speech'

// Import from services
import { FPTBotServices } from '~/services/fptbot.service'
import { CloudinaryService } from '~/services/cloudinary'

// Import from utils
import { HttpStatusCode } from '~/utilities/constants'

/**
 * Use this function to insert a speech to database.
 * @param {Request} req
 * @param {Response} res
 */
async function createSpeech(req, res) {
  try {
    const { search, text } = req.body
    const response = await FPTBotServices.getPredict(search)
    const responseAsJSON = await response.json()
    const predict = responseAsJSON.data.intents[0]

    // Insert to database
    const insertResult = await SpeechModel.insertOne({ intent: predict.label, text })

    return res.status(HttpStatusCode.OK).json(insertResult)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Use this function to get speech from query string (text).
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function getSpeechByText(req, res) {
  try {
    const { text } = req.query
    const response = await FPTBotServices.getPredict(text)
    const responseAsJSON = await response.json()
    const predict = responseAsJSON.data.intents[0]

    // 1. Get speech doc from `predict.label`.
    const speechDoc = await SpeechModel.findOneByIntent(predict.label)
    let audio = ''

    // If not found, response
    if (!speechDoc) {
      return res.status(HttpStatusCode.OK).json({ message: `Audio for "${text}" not found` })
    }

    if (!(audio = speechDoc.audio)) {
      let fptbotResult = await FPTBotServices.getSpeech(speechDoc.text)
      let fptbotResultData = await fptbotResult.json()
      let cloudinaryResult = await CloudinaryService.uploadAsync(fptbotResultData.async, { folder: 'audios', resource_type: 'auto' })
      let url = cloudinaryResult.url

      await SpeechModel.updateOneById(speechDoc._id, { audio: url })

      return res.status(HttpStatusCode.OK).json({ audio: cloudinaryResult.url })
    }

    // 2. Get url from speech.url and send back to user.
    return res.status(HttpStatusCode.OK).json({ audio })
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

/**
 * Use this function to get URL of Speech directly.
 * @param {Request} req
 * @param {Response} res
 * @returns
 */
async function getSpeechURL(req, res) {
  try {
    const { text } = req.body
    const response = await FPTBotServices.getSpeech(text)
    const data = await response.json()

    return res.status(HttpStatusCode.OK).json({ audio: data.async })
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const SpeechController = {
  createSpeech,
  getSpeechByText,
  getSpeechURL
}