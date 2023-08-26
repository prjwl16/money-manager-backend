import express from 'express'
const baseRouter = express()
import authRouter from './auth.js'
import whatsApp from './whatsAppBot.js'
import { googleRouter } from './oauthGoogle.js'
import { userRouter } from './user.js'
import { splitwiseRouter } from './oauthSplitwise.js'

baseRouter.use('/auth', authRouter)
baseRouter.use('/oauth/google', googleRouter)
baseRouter.use('/oauth/splitwise', splitwiseRouter)
baseRouter.use('/user', userRouter)

baseRouter.use('/', whatsApp)

export default baseRouter
