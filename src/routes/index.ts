import { Router } from 'express'
import { verifyToken } from '../middleware/jwt.js'
import whatsApp from './whatsAppBot.js'
import { googleRouterAuth } from './oauthGoogle.js'
import { userRouter } from './user.js'
import { splitwiseRouterAuth } from './oauthSplitwise.js'
import { splitwiseRouter } from './splitwise.js'
import { playgroundRouter } from './playground.js'
import { transactionRouter } from './transaction.js'
import { categoryRouter } from './categories.js'
import { accountRouter } from './accounts.js'
import { cardRouter } from './cards.js'

const router = Router()

router.use('/whatsapp', whatsApp)

//Oauth
const oauthRoutes = Router()
oauthRoutes.use('/google', googleRouterAuth)
oauthRoutes.use('/splitwise', splitwiseRouterAuth)

//Api and token
const tokenRoutes = Router()
tokenRoutes.use('/user', userRouter)
tokenRoutes.use('/splitwise', splitwiseRouter)
tokenRoutes.use('/transaction', transactionRouter)
tokenRoutes.use('/category', categoryRouter)
tokenRoutes.use('/account', accountRouter)
tokenRoutes.use('/play', playgroundRouter)
tokenRoutes.use('/cards', cardRouter)

router.use('/api', verifyToken, tokenRoutes)
router.use('/oauth', oauthRoutes)

export { router }
