import Joi from 'joi'
import { HttpStatusCode } from '../utilities/constants'

const uploadMultiDocsWebsite = async (req, res, next) => {
  const condition = Joi.object({
    websites: Joi.array(Joi.string).required(),
    selector: Joi.string().required(),
    chunkSize: Joi.number().required(),
    chunkOverlap: Joi.number().required()
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

const uploadMultiDocs = async (req, res, next) => {
  const condition = Joi.object({
    directory: Joi.string().required(),
    type_file: Joi.string().required(),
    chunkSize: Joi.number().required(),
    chunkOverlap: Joi.number().required()
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

const testScratchWebsite = async (req, res, next) => {
  const condition = Joi.object({
    website: Joi.string().required(),
    selector: Joi.string().required()
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
  uploadMultiDocsWebsite,
  uploadMultiDocs,
  testScratchWebsite
}
