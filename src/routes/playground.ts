import { Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import prisma from '../../prisma/client.js'

const router = Router()

router.get('/', async (_req, res) => {
  //get groups of a user

  const { id } = res.locals.user

  const groups = await prisma.userGroup.findMany({
    where: {
      user: {
        id,
      },
    },
  })
  return res.send({
    success: true,
    data: groups,
    error: null,
  })
})

export { router as playgroundRouter }
