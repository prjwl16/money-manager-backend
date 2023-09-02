import { Router } from 'express'
import { constMarkDone, get } from '../controller/userController.js'

const router = Router()

router.get('/', get)
router.patch('/mark-done', constMarkDone)

export { router as userRouter }
