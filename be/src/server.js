import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/cors'
import { env } from './config/environment'
import { apiV1 } from './routes/v1'

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/v1', cors(corsOptions), apiV1)

app.listen(process.env.PORT || env.APP_PORT, process.env.APP_HOST || env.APP_HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Hello FSN, I am running at ${ process.env.APP_HOST || env.APP_HOST }:${ process.env.PORT || env.APP_PORT}/`)
})
