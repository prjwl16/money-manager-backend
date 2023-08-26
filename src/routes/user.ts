import { Router } from 'express'
import { getUser } from '../controller/userController.js'
import { verifyToken } from '../middleware/jwt.js'

const router = Router()

router.get('/', verifyToken, getUser)

export { router as userRouter }
