import { Router } from 'express'
import { Request, Response } from 'express'
import prisma from '../../prisma/client.js'

const router = Router()

const transactionModule = {
  getTransactions: async (req: Request, res: Response) => {
    const { id } = res.locals.user
  },
  addTransaction: async (req: Request, res: Response) => {
    const { id } = res.locals.user
    const body = req.body

    try {
      const users = []
      body.users.map((row: { id: number; splitPaid: number; splitShare: number }) => {
        users.push({
          userId: row.id,
          splitPaid: row.splitPaid,
          splitShare: row.splitShare,
        })
      })

      const response = await prisma.transaction.create({
        data: {
          name: body.name,
          amount: body.amount,
          type: body.type,
          date: new Date(body.date),
          isRecurring: body.isRecurring ? body.isRecurring : false,
          recurringStartDate: body.recurringStartDate ? new Date(body.recurringStartDate) : undefined,
          recurringEndDate: body.recurringEndDate ? new Date(body.recurringEndDate) : undefined,
          recurringPeriod: body.recurringPeriod ? body.recurringPeriod : 'ONETIME',
          recurringPeriodCount: body.recurringPeriodCount,
          createdByUser: {
            connect: {
              id,
            },
          },
          account: {
            connect: {
              id: body.accountId,
            },
          },
          category: {
            connect: {
              id: body.categoryId,
            },
          },
          groups: {
            connect: {
              id: body.groupId,
            },
          },
          userTransaction: {
            createMany: {
              data: users,
            },
          },
        },
      })

      return res.send({
        success: true,
        data: response,
        error: null,
      })
    } catch (e) {
      console.log('Error : ', e)
      return res.boom.badRequest("Couldn't add transaction")
    }
  },
}

router.get('/', transactionModule.getTransactions)
router.post('/', transactionModule.addTransaction)

export { router as transactionRouter }
