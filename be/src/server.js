import express from 'express'
import cors from 'cors'

// Import from config
import { corsOptions } from './config/cors'
import { env } from './config/environment'
import { connectDB } from './config/mongodb'

// Import from routes
import { apiV1 } from './routes/v1'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1', cors(corsOptions), apiV1)

connectDB().then(function() {
  console.log('Database is connected')
  app.listen(process.env.PORT || env.APP_PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Hello FSN, I'm running at port: ${process.env.PORT || env.APP_PORT}`)
  })
})