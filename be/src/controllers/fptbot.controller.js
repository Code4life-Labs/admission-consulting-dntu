// Import from services
import { FPTBotServices } from '~/services/fptbot.service'

// Import from utils
import { HttpStatusCode } from '~/utilities/constants'

/**
 * Use this function to get answer from bot.
 * @param {*} res
 * @param {*} req
 */
async function getAnswer(req, res) {
  try {
    const { content, type = 'text' } = req.body
    const response = await FPTBotServices.getAnswer(content, type)
    const result = await response.json()
    return res.status(HttpStatusCode.OK).json(result)
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const FPTController = {
  getAnswer
}