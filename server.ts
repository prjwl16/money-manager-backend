import 'dotenv/config'
import express from 'express'
import logger from './src/utils/logger.js'
import { router } from './src/routes/index.js'
import './src/config/passport.js'
import { Middlewares } from './src/middleware/index.js'
import config from 'config'

//Add global variables
// @ts-ignore
global.logger = logger
// @ts-ignore
global.config = config

//Initiate express app
const app = express()
const port: number = config.get('port')
//All middlewares
Middlewares(app)

//Test route
app.get('/', async (_req, res) => {
  return res.send({ success: true, message: "hooray.... it's working bruh" })
})

app.use(router)
app.listen(port, () => {
  console.log(`App listening on ${port} in ${process.env.NODE_ENV} mode`)
})
