import 'dotenv/config'
import express from 'express'
import { router } from './src/routes'
import './src/config/passport.js'
import config from 'config'
import { Middlewares } from './src/middleware'

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

//Remove all locals
app.use((_req, res) => {
  res.locals = {}
})
app.listen(port, () => {
  console.log(`App listening on ${port} in ${process.env.NODE_ENV} mode`)
})
