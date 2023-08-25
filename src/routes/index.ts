import express from 'express'
const baseRouter = express()
import authRouter from './auth.js'
import whatsApp from './whatsAppBot.js'
import { oauthRouter } from './oauth.js'
import { userRouter } from './user.js'

baseRouter.use('/auth', authRouter)
baseRouter.use('/oauth', oauthRouter)
baseRouter.use('/user', userRouter)

baseRouter.use('/', whatsApp)

export default baseRouter
