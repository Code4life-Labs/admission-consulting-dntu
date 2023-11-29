import Joi from 'joi/lib'

const self = Joi.object({
  intent: Joi.string().required(),
  audio: Joi.string().default(''),
  text: Joi.string().required(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp().default(null)
})

export async function validateAsync(data) {
  return await self.validateAsync(data)
}

export const SpeechSchema = {
  self,
  validateAsync
}