require('dotenv').config()

export const env = {
  APP_HOST: process.env.APP_HOST,
  APP_PORT: process.env.APP_PORT,
  BUILD_MODE: process.env.BUILD_MODE,
  CHATGPT_API_KEY: process.env.CHATGPT_API_KEY,
  FPT_BOT_CODE: process.env.FPT_BOT_CODE,
  FPT_SENDER_ID: process.env.FPT_SENDER_ID,
  FPT_API_KEY: process.env.FPT_API_KEY,
  FPT_WEBHOOK_TOKEN: process.env.FPT_WEBHOOK_TOKEN,
  FPT_TTS_API_KEY: process.env.FPT_TTS_API_KEY,
  CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,
  CLIENT: process.env.CLIENT
}