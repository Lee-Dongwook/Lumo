import { Sentry } from './sentry'
import dotenv from 'dotenv'
dotenv.config()
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

const app = express()
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
)

app.use(helmet())

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(Sentry.Handlers.errorHandler())

app.listen(8080, () => {
  console.log('Server is running on port 8080')
  // TEST PUSH NOTIFICATION
})
