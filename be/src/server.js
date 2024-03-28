import express from 'express'
import cors from 'cors'

// Import from config
import { corsOptions } from './config/cors'
import { env } from './config/environment'
import { connectDB } from './config/mongodb'

// Import from routes
import { apiV1 } from './routes/v1'
import { uploadDocumentsToSupabaseCloud, uploadMultiWebsitesToSupabaseCloud } from './providers/chatbot/upload_documents'
import { getAnswerDocumentAssistant } from './providers/chatbot/document_assistant'
import { getAnswerNormalAssistant } from './providers/chatbot/answer_assistant'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1', apiV1)

connectDB().then(function() {
  app.listen(process.env.PORT || env.APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello FSN, I'm running at port: ${process.env.PORT || env.APP_PORT}`)
    getAnswerNormalAssistant('àkn', 'Bạn có biết giữa dev và coder khác nhau gì không', 'Nhật Phương')
    // getAnswerDocumentAssistant('dasd', 'trường có ngành It không', 'phương')
    // uploadDocumentsToSupabaseCloud()
    //
    // const websiteUrls = [
    //   'https://dntu.edu.vn/dao-tao/khoa-cong-nghe-thong-tin',
    //   'https://dntu.edu.vn/dao-tao/khoa-ky-thuat',
    //   'https://dntu.edu.vn/dao-tao/khoa-kinh-te-quan-tri',
    //   'https://dntu.edu.vn/dao-tao/khoa-ke-toan-tai-chinh',
    //   'https://dntu.edu.vn/dao-tao/khoa-ngoai-ngu',
    //   'https://dntu.edu.vn/dao-tao/khoa-truyen-thong-thiet-ke',
    //   'https://dntu.edu.vn/dao-tao/khoa-cong-nghe',
    //   'https://dntu.edu.vn/dao-tao/khoa-khoa-hoc-suc-khoe'
    // ]

    // uploadMultiWebsitesToSupabaseCloud(websiteUrls)
  })
})