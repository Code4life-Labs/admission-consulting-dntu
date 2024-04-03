import { Request, Response } from 'express'

// Import from providers
import { ChatGptProvider } from '~/providers/gpt/ChatGptProvider'

// Import from utils
import { HttpStatusCode } from '~/utilities/constants'
import removeMarkdown from 'markdown-to-text'
/**
 * Use this function to insert a speech to database.
 * @param {Request} req
 * @param {Response} res
 */
async function getSpeechByText(req, res) {
  try {
    const text = removeMarkdown(req.body.text)
    console.log('🚀 ~ getSpeechByText ~ text:', text)
    const format = 'aac'
    const buf = await ChatGptProvider.generateSpeech(text)
    res.setHeader('Content-Type', 'audio/' + format)
    res.write(new Uint8Array(buf), 'binary')
    return res.end(null, 'binary')
  } catch (error) {
    return res.status(HttpStatusCode.INTERNAL_SERVER).json({
      errors: error.message
    })
  }
}

export const OpenAISpeechController = {
  getSpeechByText
}