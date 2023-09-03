import { Router } from 'express'
import { get, newUserSetUp } from '../controller/userController.js'

const router = Router()

router.get('/', get)
router.patch('/setup', newUserSetUp)

export { router as userRouter }
