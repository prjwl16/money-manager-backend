import 'dotenv/config'
import express from 'express'
import './src/config/passport.js'
import config from 'config'
import { sendMessage } from './src/APIs/bots/twilioCalls.js'
import { Middlewares } from './src/middleware/index.js'
import { router } from './src/routes/index.js'

//Initiate express app
const app = express()
const port: number = config.get('port')

//All middlewares
Middlewares(app)

//Test route
app.get('/', async (_req, res) => {
  await sendMessage('Hello', '919527189354')
  return res.send({ success: true, message: "hooray.... it's working bruh" })
})

app.use(router)

//Remove all locals
app.listen(port, () => {
  console.log(`App listening on ${port} in ${process.env.NODE_ENV} mode`)
})
