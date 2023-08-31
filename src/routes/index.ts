import express from 'express'
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

const router = express()

router.use('/oauth/google', googleRouterAuth)
router.use('/oauth/splitwise', splitwiseRouterAuth)
router.use('/api/play', playgroundRouter)
router.use('/user', userRouter)
router.use('/api/splitwise', verifyToken, splitwiseRouter)
router.use('/api/user/txn', verifyToken, transactionRouter)
router.use('/api/category', categoryRouter)
router.use('/api/account', verifyToken, accountRouter)

router.use('/whatsapp', whatsApp)

export { router }
