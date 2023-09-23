import { Router } from 'express'
import { Request, Response } from 'express'
import prisma from '../../prisma/client.js'

const router = Router()

//private functions
const addTransaction = async (data, userId: number) => {
  try {
    const response = await prisma.transaction.create({
      data: {
        type: data.type,
        name: data.name,
        amount: data.amount,
        currency: data.currency,
        description: data.description || '',
        date: data.date ? new Date(data.date) : new Date(),
        place: data.place,
        isRecurring: data.isRecurring,
        recurringPeriod: data.recurringPeriod,
        recurringPeriodCount: data.recurringPeriodCount,
        recurringStartDate: data.recurringStartDate ? new Date(data.recurringStartDate) : undefined,
        recurringEndDate: data.recurringEndDate ? new Date(data.recurringEndDate) : undefined,
        createdByUser: {
          connect: {
            id: userId,
          },
        },
        account: {
          connect: {
            id: data.accountId,
          },
        },
        category: {
          connect: {
            id: data.categoryId,
          },
        },
      },
    })
    return response
  } catch (e) {
    console.log('ERR: ', e)
    throw Error('Failed to add transaction')
  }
}

const transactionModule = {
  getTransactions: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const offset = parseInt(req.params.offset) || 0

    try {
      const response = await prisma.transaction.findMany({
        where: {
          createdByUser: {
            id,
          },
        },
        skip: offset * 10,
        take: 10,
      })
      return res.send({
        success: true,
        data: response,
      })
    } catch (e) {
      console.log('ERR: ', e)
      return res.boom.badRequest('Failed to get transactions', {
        success: false,
      })
    }
  },

  addTransaction: async (req: Request, res: Response) => {
    try {
      const { id } = res.locals.user
      const data = req.body
      const txn = await addTransaction(data, id)

      return res.send({
        success: true,
        data: txn,
        error: null,
      })
    } catch (e) {
      console.log('Error : ', e)
      return res.boom.badRequest('Failed to add transaction')
    }
  },
}

router.get('/', transactionModule.getTransactions)
router.post('/', transactionModule.addTransaction)

export { router as transactionRouter }
