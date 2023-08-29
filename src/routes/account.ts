import { Router } from 'express'
import { add, get } from '../controller/account.js'

const router = Router()

router.get('/', get)
router.post('/add', add)

export { router as accountRouter }
