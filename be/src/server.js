import express from 'express'
import cors from 'cors'

// Import from config
import { corsOptions } from './config/cors'
import { env } from './config/environment'
import { connectDB } from './config/mongodb'
import cookieParser from 'cookie-parser'
// Import from routes
import { apiV1 } from './routes/v1'
import { uploadDocumentsToSupabaseCloud, uploadMultiWebsitesToSupabaseCloud, uploadWebsiteToSupabaseCloud } from './providers/chatbot/upload_documents'
import { getAnswerDocumentAssistant } from './providers/chatbot/document_assistant'
import { getAnswerNormalAssistant } from './providers/chatbot/answer_assistant'

import http from 'http'
import socketIo from 'socket.io'
import { createSocketIdMap } from './sockets/userSocket'
import { createAnswerFromAI } from './sockets/answerSocket'


connectDB()
  .then(() => console.log('Connected successfully to database server!'))
  .then(() => bootServer())
  .catch(error => {
    console.error(error)
    process.exit(1)
  })


const bootServer = () => {
  // Phuong: sử dụng express
  const app = express()
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store')
    next()
  })

  app.use(cookieParser())

  app.use(cors({ origin: '*' }))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use('/v1', apiV1)

  let socketIdMap = {}

  const server = http.createServer(app)
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  })
  io.on('connection', (socket) => {
    // cho id tham gia vào mạng
    socket.join(socket.id)

    // lắng nghe sự kiện khi người dùng nhấp vào mở ô chot góc trên bên phải màn hình
    // id sẽ được tạo ngẫu nhiên để nhận biết giữa các lần hoặc các user đang thực hiện
    socket.on('c_user_login', (accountId) => {
      console.log('Client Connected', accountId)

      // lưu socket ID của tài khoản đăng nhập vào biến socketIdMap
      socketIdMap[accountId] = socket.id
      console.log('🚀 ~ file: server.js:69 ~ socket.on ~ socketIdMap:', socketIdMap)
    })

    // Hàm xử lý tạo câu trả cho user
    createAnswerFromAI(io, socket, socketIdMap)

    socket.on('disconnect', () => {
      let ids = Object.keys(socketIdMap)
      for (let id of ids) {
        if (socketIdMap[id] === socket.id) delete socketIdMap[id]
      }
      console.log('🚀 ~ file: server.js:59 ~ socket.on ~ socketIdMap:', socketIdMap)
      console.log('Client disconnected: ', socket.id)
    })

  })

  server.listen(process.env.PORT || env.APP_PORT, () => {
    console.log(`Hello
    FSN, I'm running at port: ${process.env.PORT || env.APP_PORT}`)
    // getAnswerNormalAssistant({
    //   sessionId: 'dasd',
    //   question: 'Sựu khác nhau giữa coder và dev',
    //   user_name: 'phương',
    //   type: 'NORMAL'
    // })
    // uploadWebsiteToSupabaseCloud('https://dntu.edu.vn/dao-tao/khoa-cong-nghe-thong-tin/cong-nghe-thong-tin')
    // getAnswerNormalAssistant()
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
}
