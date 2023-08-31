import { Router } from 'express'
import { add, get } from '../controller/category.js'

const router = Router()

router.get('/', get)
router.post('/', add)

export { router as categoryRouter }
