import { Router } from 'express'
import { get } from '../controller/userController.js'

const router = Router()

router.get('/', get)

export { router as userRouter }
