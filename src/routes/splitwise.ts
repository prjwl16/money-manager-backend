import { Router } from 'express'
import { getExpenses, getFriend, getFriends, getGroups } from '../controller/splitwiseController.js'

const router = Router()

router.get('/expenses', getExpenses)
router.get('/friends', getFriends)
router.get('/groups', getGroups)
router.get('/friend/{id}', getFriend)

export { router as splitwiseRouter }
