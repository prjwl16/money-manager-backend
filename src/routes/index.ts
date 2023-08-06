import express from 'express'
const baseRouter = express()
import authRouter from './auth.js'
import whatsApp from './whatsAppBot.js'

baseRouter.use('/auth', authRouter)
baseRouter.use('/', whatsApp)

export default baseRouter
