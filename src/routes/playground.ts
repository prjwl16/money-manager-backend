import { Router } from 'express'
import prisma from '../../prisma/client.js'

const router = Router()

router.get('/', async (_req, res) => {
  //get groups of a user

  const { id } = res.locals.user

  return res.send({
    success: true,
    data: 'groups',
    error: null,
  })
})

export { router as playgroundRouter }
