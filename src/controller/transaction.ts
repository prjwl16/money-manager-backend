import { Request, Response } from 'express'
import { fetchTransactionOfUser } from '../db/user.js'
import { addSubscription } from '../db/transaction.js'
import { getAccountByName } from '../db/account.js'
import { getGroupByName } from '../db/group.js'

export const get = async (req: Request, res: Response) => {
  let response: Record<any, any> = {}
  const { id } = res.locals.user
  try {
    console.log('Fetching transaction of user: ', id)
    response['transaction'] = await fetchTransactionOfUser(id)
    return res.send(response)
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      data: response,
      error: err,
    })
  }
}

//For now, building this only for subscriptions
export const add = async (req: Request, res: Response) => {
  const body = req.body
  const { id } = res.locals.user

  const subscriptionObject = {
    type: body.type,
    amount: body.amount,
    particular: body.particular,
    description: body.description,
    date: body.date,
    isSubscription: body.isSubscription,
    subscriptionStartDate: body.subscriptionStartDate,
    subscriptionEndDate: body.subscriptionEndDate,
    plan: body.plan,
    groupId: body.groupId,
    category: body.categoryId,
    accountId: body.accountId,
    paidById: id,
    createdById: id,
    updatedByIds: [id],
    userId: id,
  }

  if (subscriptionObject.isSubscription && !subscriptionObject.plan) subscriptionObject.plan = 'MONTHLY'

  console.log('Adding subscription: ', subscriptionObject)
  try {
    const response = await addSubscription(subscriptionObject)
    return res.send({
      success: true,
      data: response,
      message: 'Subscription added successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      success: false,
      error: err,
    })
  }
}
