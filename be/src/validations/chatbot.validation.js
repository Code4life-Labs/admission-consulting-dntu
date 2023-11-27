import Joi from 'joi'
import { HttpStatusCode } from '../utilities/constants'

const getTextConsulting = async (req, res, next) => {
  const condition = Joi.object({
    question: Joi.string().required(),
    currentUserId: Joi.string().required(),
    languageCode: Joi.string().required()
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

const generateTextGPT = async (req, res, next) => {
  const condition = Joi.object({
    textInitial: Joi.string().required(),
    textTranslated: Joi.string().required()
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

const translateTextGPT = async (req, res, next) => {
  const condition = Joi.object({
    text: Joi.string().required(),
    languageConvert: Joi.string().required()
  })
  try {
    await condition.validateAsync(req.body, { abortEarly: false })
    next()
  } catch (error) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      errors: new Error(error).message
    })
  }
}

export const ChatbotValidation = {
  getTextConsulting,
  generateTextGPT,
  translateTextGPT
}
