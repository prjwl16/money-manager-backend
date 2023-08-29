import express from 'express'
const baseRouter = express()
import authRouter from './auth.js'
import whatsApp from './whatsAppBot.js'
import { googleRouterAuth } from './oauthGoogle.js'
import { userRouter } from './user.js'
import { splitwiseRouterAuth } from './oauthSplitwise.js'
import { verifyToken } from '../middleware/jwt.js'
import { splitwiseRouter } from './splitwise.js'
import { playgroundRouter } from './playground.js'
import { transactionRouter } from './transaction.js'
import { categoryRouter } from './category.js'
import { accountRouter } from './account.js'

baseRouter.use('/auth', authRouter)
baseRouter.use('/oauth/google', googleRouterAuth)
baseRouter.use('/oauth/splitwise', splitwiseRouterAuth)
baseRouter.use('/user', userRouter)
baseRouter.use('/api/splitwise', verifyToken, splitwiseRouter)
baseRouter.use('/api/play', playgroundRouter)
baseRouter.use('/api/user/txn', verifyToken, transactionRouter)
baseRouter.use('/api/category', categoryRouter)
baseRouter.use('/api/account', verifyToken, accountRouter)

baseRouter.use('/', whatsApp)

export { baseRouter }
