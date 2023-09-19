import { Router } from 'express'
import { Request, Response } from 'express'
import prisma from '../../prisma/client.js'

const groupModule = {
  getgroups: async (req: Request, res: Response) => {
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
  },
}

const router = Router()
router.get('/', groupModule.getgroups)

export { router as groupRouter }
