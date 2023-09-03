import prisma from '../../prisma/client.js'
import { Prisma } from '@prisma/client'

const Transaction = prisma.transaction

export const addSubscription = async (subscriptionObj: Prisma.TransactionCreateInput) => {
  Transaction.create({
    data: subscriptionObj,
  })
}
