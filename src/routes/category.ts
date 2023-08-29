import { Router } from 'express'
import { add, fetch } from '../controller/category.js'
import { verifyToken } from '../middleware/jwt.js'

const router = Router()

router.get('/', verifyToken, fetch)
router.post('/add', verifyToken, add)

export { router as categoryRouter }
