import { Request, Response, Router } from 'express'
import prisma from '../../prisma/client.js'

const router = Router()

const accountModule = {
  getAccounts: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    try {
      const response = await prisma.account.findMany({
        where: {
          userId: id,
        },
      })
      res.status(200).json(response)
    } catch (e) {
      console.log('ERR: ', e)
      res.status(500).json({ error: 'Failed to get accounts' })
    }
  },
  addAccount: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const { name, balance, isDefault } = req.body
    try {
      const response = await prisma.account.create({
        data: {
          name,
          balance,
          userId: id,
          isDefault,
        },
      })
      res.status(200).json(response)
    } catch (e) {
      console.log('ERR: ', e)
      res.status(500).json({ error: 'Failed to add account', success: false })
    }
  },
}

router.get('/', accountModule.getAccounts)
router.post('/', accountModule.addAccount)

export { router as accountRouter }
