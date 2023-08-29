import prisma from '../../prisma/client.js'

const Transaction = prisma.transaction

export const addSubscription = async (subscriptionObj: any) => {
  Transaction.create({
    data: {
      ...subscriptionObj,
      usersInTransactions: {
        create: {
          user: {
            connect: {
              id: subscriptionObj.userId,
            },
          },
        },
      },
    },
  })
}
