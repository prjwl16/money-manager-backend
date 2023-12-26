import 'dotenv/config'
import './src/config/passport.js'
import express from 'express'
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

//write a node-schedule to run every day at 12:00 AM to add recurring transactions to the database
import schedule from 'node-schedule'
import { fetchAndAddTransactions } from './src/utils/scheduler.js'

schedule.scheduleJob(
  {
    hour: 0,
    minute: 0,
  },
  async () => {
    console.log('Running a job at 12:00 AM')
    const startTime = new Date().getTime()
    await fetchAndAddTransactions()
    const endTime = new Date().getTime()
    console.log('Time taken to run the job: ', endTime - startTime)
  }
)

//Remove all locals
app.listen(port, () => {
  console.log(`App listening on ${port} in ${process.env.NODE_ENV} mode`)
})
