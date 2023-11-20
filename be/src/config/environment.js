require('dotenv').config()

export const env = {
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  CHATGPT_API_KEY: process.env.CHATGPT_API_KEY
}
