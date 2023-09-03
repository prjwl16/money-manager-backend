import { Request, Response } from 'express'
import { fetchTransactionOfUser } from '../db/user.js'
import { addSubscription } from '../db/transaction.js'
import { Prisma } from '@prisma/client'

export const get = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const response: Record<any, any> = {}
    response['transactions'] = await fetchTransactionOfUser(id)
    return res.send({
      success: true,
      data: response,
      message: 'Transactions fetched successfully',
    })
  } catch (err) {
    return res.boom.badRequest('Failed to get transactions', { success: false, err })
  }
}

//For now, building this only for subscriptions
export const add = async (req: Request, res: Response) => {
  const body = req.body
  const { id } = res.locals.user

  //Test this out for how connect works in prisma.
  const subscriptionObject: Prisma.TransactionCreateInput = {
    type: body.type,
    amount: body.amount,
    name: body.name,
    description: body.description,
    date: body.date,
    isSubscription: body.isSubscription,
    subscriptionStartDate: body.subscriptionStartDate,
    subscriptionEndDate: body.subscriptionEndDate,
    plan: body.plan,
    groups: {
      connect: {
        id: body.groupId,
      },
    },
    category: body.categoryId,
    account: body.accountId,
    paidBy: id,
    createdBy: id,
    updatedByIds: [id],
    usersInTransactions: {
      create: [
        {
          // userId: id //TODO: test this also
          user: id,
        },
      ],
    },
  }

  if (subscriptionObject.isSubscription && !subscriptionObject.plan) subscriptionObject.plan = 'MONTHLY'

  try {
    const response = await addSubscription(subscriptionObject)
    return res.send({
      success: true,
      data: response,
      message: 'Subscription added successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.boom.badRequest('Failed to add subscription', { success: false })
  }
}
