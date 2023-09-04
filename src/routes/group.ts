import { Router } from 'express'
import { addUserToTheGroup, get } from '../controller/group.js'

const router = Router()

router.get('/', get)
router.post('/:groupId/user', addUserToTheGroup)

export { router as groupRouter }
