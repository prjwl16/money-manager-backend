import { Router } from 'express'
import { Request, Response } from 'express'
import prisma from '../prisma/client.js'
const router = Router()

const limit = 10

const cardModule = {
  getIncomeAndExpense: async (req: Request, res: Response) => {
    // 1) Total monthly expesne and income for last 3 months
    // 2) Total monthly expense
    // 3) Total monthly recurring only expense

    try {
      const { id } = res.locals.user
    } catch (e) {
      console.log('ERR: ', e)
      throw Error('Failed to get cards details')
    }
  },
}

router.get('/cards')
router.get('/income-expense', cardModule.getIncomeAndExpense)

export { router as cardRouter }
