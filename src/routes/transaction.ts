import { Request, Response, Router } from 'express'
import prisma from '../../prisma/client.js'
import moment from 'moment'
import { calculateEndDate, getMomentPeriods, verifyAccount, verifyCategory } from '../utils/utils.js'
import { TransactionFilterType } from '../types/transaction.js'

const router = Router()
const limit = 15

//private functions
export const addTransaction = async (data, userId: number) => {
  try {
    const response = {}
    await verifyAccount(data.accountId, userId)
    await verifyCategory(data.categoryId, userId)

    await prisma.$transaction(async (prisma) => {
      let recurringTransactionId = undefined
      if (data.isRecurring) {
        if (!data.numberOfOccurrences || !data.recurringPeriod)
          throw Error('numberOfOccurrences and recurringPeriod are required for recurring transactions')

        const recurringPeriod = getMomentPeriods(data.recurringPeriod)

        //check if the startDate is greater than today, if yes then nextExecution date will be start date

        const nextExecutionDate =
          new Date(data.startDate) >= new Date()
            ? new Date(data.startDate)
            : moment(data.startDate).add(1, recurringPeriod).toDate()

        const endDate = calculateEndDate(data.startDate, data.endDate, data.numberOfOccurrences, recurringPeriod)
        const recurringTransaction = await prisma.recurringTransaction.create({
          data: {
            type: data.type,
            name: data.name,
            amount: data.amount,
            currency: data.currency,
            description: data.description || '',
            date: data.date ? new Date(data.date) : new Date(),
            startDate: data.startDate ? new Date(data.startDate) : data.date ? new Date(data.date) : new Date(),
            endDate: endDate,
            numberOfOccurrences: data.numberOfOccurrences,
            nextExecutionDate: new Date(nextExecutionDate),
            recurringPeriod: data.recurringPeriod,
            isActive: true,
            place: data.place,
            user: {
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
        recurringTransactionId = recurringTransaction.id
        response['recurringTransaction'] = recurringTransaction
      }

      //if the transaction is recurring and startDate is in the past, then add transaction
      if (!data.startDate || (data.startDate && new Date(data.startDate) <= new Date())) {
        response['transaction'] = await prisma.transaction.create({
          data: {
            type: data.type,
            name: data.name,
            amount: data.amount,
            currency: data.currency,
            description: data.description || '',
            date: data.date ? new Date(data.date) : new Date(),
            place: data.place,
            isRecurring: data.isRecurring,
            recurringTransactions: recurringTransactionId
              ? {
                  connect: {
                    id: recurringTransactionId,
                  },
                }
              : undefined,
            user: {
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
      }
    })
    return response
  } catch (e) {
    console.log('ERR: ', e)
    throw e || 'Failed to add transaction'
  }
}

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

const getTransactions = async (body: TransactionFilterType) => {
  const { userId, type, fromDate, toDate, offset = 0, order } = body

  // if order has more than 1 keys then throw error
  if (order && Object.keys(order).length > 1) {
    throw Error('Only one order key is allowed')
  }

  const response = {}
  await prisma.$transaction(async (prisma) => {
    const transactions = await prisma.transaction.findMany({
      where: {
        user: {
          id: userId,
        },
        type,
        date: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
      },
      skip: offset * limit,
      take: limit,
      orderBy: {
        ...order,
      },
    })
    response['transactions'] = transactions
    //count number of transactions and sum of amount of transactions with given filters
    const count = await prisma.transaction.count({
      where: {
        user: {
          id: userId,
        },
        type,
        date: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
      },
    })

    const sum = await prisma.transaction.aggregate({
      where: {
        user: {
          id: userId,
        },
        type,
        date: {
          gte: fromDate ? new Date(fromDate) : undefined,
          lte: toDate ? new Date(toDate) : undefined,
        },
      },
      _sum: {
        amount: true,
      },
    })
    response['total'] = count
    response['sum'] = sum._sum.amount
  })

  return response
}

const transactionModule = {
  get: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const offset = parseInt(req.params.offset) || 0
    try {
      const response = await prisma.transaction.findMany({
        where: {
          user: {
            id,
          },
        },
        skip: offset * limit,
        take: limit,
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

  add: async (req: Request, res: Response) => {
    try {
      const { id } = res.locals.user
      const data = req.body
      const transaction = await addTransaction(data, id)

      return res.send({
        success: true,
        data: transaction,
        error: null,
      })
    } catch (e) {
      console.log('Error: ', e.message)
      return res.boom.badRequest(e || 'Failed to add transaction')
    }
  },

  getFilteredTransactions: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const offset = parseInt(req.params.offset) || 0
    try {
      const response = await getTransactions(req.body)
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

  getUpcomingTransactions: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const offset = parseInt(req.params.offset) || 0

    const toDate = req.body.toDate ? new Date(req.body.toDate) : moment().add(3, 'days').toDate()

    try {
      const response = await prisma.recurringTransaction.findMany({
        where: {
          user: {
            id,
          },
          nextExecutionDate: {
            lte: toDate,
            gte: new Date(),
          },
          isActive: true,
        },
        skip: offset * limit,
        take: limit,
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

  getRecurringTransactions: async (req: Request, res: Response) => {
    try {
      const { id } = res.locals.user
      const query = JSON.parse(req.query.q as string)
      const offset = parseInt(query.offset) || 0
      const { type, sort, order } = query

      const response = await prisma.recurringTransaction.findMany({
        where: {
          user: {
            id,
          },
          type,
        },
        orderBy: {
          [sort]: order,
        },
        skip: offset * limit,
        take: limit,
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
}

router.get('/recurring', transactionModule.getRecurringTransactions)
router.get('/:offset', transactionModule.get)
router.post('/', transactionModule.add)
router.post('/:offset', transactionModule.getFilteredTransactions)
router.get('/upcoming/:offset', transactionModule.getUpcomingTransactions)

export { router as transactionRouter }
