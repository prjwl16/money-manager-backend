import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import morgan from 'morgan' //for printing API logs
import logger from './src/utils/logger.js'
import * as process from 'process'
import baseRouter from './src/routes/index.js'

//Add logger
// @ts-ignore
global.logger = logger

//Initiate express app
const app = express()
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000

//Add middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'DEV') {
  app.use(morgan('dev'))
}

//Test route
app.get('/', async (_req, res) => {
  return res.send({ success: true, message: "hooray.... it's working bruh" })
})

app.use(baseRouter)

app.listen(port, () => {
  console.log(`App listening on ${port} in ${process.env.NODE_ENV} mode`)
})
