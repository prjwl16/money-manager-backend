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
        userId: {
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

const limit = 10

const getFlattenTxn = (txn) => {
  const flattenTxn = txn.map((t) => {
    return {
      ...t,
      category: t.category?.name,
      account: t.account?.name,
    }
  })
  return flattenTxn
}

const transactionModule = {
  getTransactions: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const offset = parseInt(req.params.offset) || 0

    try {
      const response = await prisma.transaction.findMany({
        where: {
          userId: {
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

  getFilteredTransactions: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const offset = parseInt(req.params.offset) || 0
    try {
      const { type, category, account, currency, isRecurring, recurringPeriod, order } = req.body
      const date = order?.date
      const createdAt = order?.createdAt

      const transactions = await prisma.transaction.findMany({
        where: {
          userId: {
            id,
          },
          type: {
            equals: type,
          },
          category: {
            name: {
              equals: category,
            },
          },
          account: {
            name: {
              equals: account,
            },
          },
          currency: {
            equals: currency,
          },
          isRecurring: {
            equals: isRecurring,
          },
          recurringPeriod: {
            equals: recurringPeriod,
          },
        },
        select: {
          id: true,
          name: true,
          amount: true,
          type: true,
          date: true,
          currency: true,
          createdAt: true,
          updatedAt: true,
          isRecurring: true,
          recurringEndDate: true,
          recurringPeriod: true,
          recurringPeriodCount: true,
          recurringStartDate: true,
          category: {
            select: {
              name: true,
            },
          },
          account: {
            select: {
              name: true,
            },
          },
        },
        skip: offset * limit,
        take: limit,
        orderBy: {
          createdAt: createdAt,
          date: date,
        },
      })
      const sum = await prisma.transaction.aggregate({
        where: {
          userId: {
            id,
          },
          type: {
            equals: type,
          },
          category: {
            name: {
              equals: category,
            },
          },
          account: {
            name: {
              equals: account,
            },
          },
          currency: {
            equals: currency,
          },
          isRecurring: {
            equals: isRecurring,
          },
          recurringPeriod: {
            equals: recurringPeriod,
          },
        },
        skip: offset * limit,
        take: limit,
        _sum: {
          amount: true,
        },
      })
      const totalRecords = await prisma.transaction.count({
        where: {
          userId: {
            id,
          },
          type: {
            equals: type,
          },
          category: {
            name: {
              equals: category,
            },
          },
          account: {
            name: {
              equals: account,
            },
          },
          currency: {
            equals: currency,
          },
          isRecurring: {
            equals: isRecurring,
          },
          recurringPeriod: {
            equals: recurringPeriod,
          },
        },
      })

      const flattenTransactions = getFlattenTxn(transactions)

      return res.json({
        success: true,
        data: {
          transactions: flattenTransactions,
          length: totalRecords,
          sum: sum._sum.amount,
        },
      })
    } catch (e) {
      console.log('ERR: ', e)
      return res.boom.badRequest('Failed to get transactions', {
        success: false,
      })
    }
  },
}

router.get('/', transactionModule.getTransactions)
router.post('/', transactionModule.addTransaction)
router.post('/:offset', transactionModule.getFilteredTransactions)

export { router as transactionRouter }