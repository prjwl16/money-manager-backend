import { Router } from 'express'
import { get, add } from '../controller/transaction.js'

const router = Router()

router.get('/', get)
router.post('/', add)

export { router as transactionRouter }
