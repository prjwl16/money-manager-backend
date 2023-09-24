import { Router } from 'express'
import { Request, Response } from 'express'
import prisma from '../../prisma/client.js'
const router = Router()

const limit = 10

const cardModule = {
  getCardsDetails: async (req: Request, res: Response) => {
    // 1) Total monthly income
    // 2) Total monthly expense
    // 3) Total monthly recurring only expense

    try {
      const { id } = req.params
    } catch (e) {
      console.log('ERR: ', e)
      throw Error('Failed to get cards details')
    }
  },
}

router.get('/cards')

export { router as cardRouter }
