import { Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
})

prisma.$on('query', (e) => {
  console.log(e)
})

const router = Router()

const userId = 1
const accountId = 1
const groupId = 1
const categoryId = 1

router.get('/add', async (_req, res) => {
  const response: Record<any, any> = {}

  try {
    response['transaction'] = addTransaction()
    return res.send(response)
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      data: response,
      error: err,
    })
  }
})

router.get('/fetch', async (req, res) => {
  const response: Record<any, any> = {}

  try {
    response['transaction'] = await fetchTransaction()
    return res.send(response)
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      data: response,
      error: err,
    })
  }
})

const fetchTransaction = async () => {
  return await prisma.transaction
    .findMany({
      include: {
        User: true,
      },
    })
    .then((data) => {
      console.log('transaction', data)
      return data
    })
}

const addTransaction = async () => {
  const transaction: Prisma.TransactionCreateInput = {
    type: 'EXPENSE',
    name: 'Mehenga transaction',
    amount: 100000,
    date: new Date(),
  }

  //Personal transaction
  await prisma.transaction
    .create({
      data: {
        type: 'EXPENSE',
        name: transaction.name,
        amount: transaction.amount,
        date: transaction.date,
        accountId: accountId,
        categoryId: categoryId,
        groupId: groupId,
        userId: userId,
        userTransaction: {
          create: {
            userId: userId,
            splitPaid: transaction.amount,
            splitShare: transaction.amount,
          },
        },
      },
    })
    .then((data) => {
      console.log('transaction', data)
      return data
    })
}

const addAccount = async () => {
  const account: Prisma.AccountCreateInput = {
    name: 'test',
    type: 'CREDIT_CARD',
    balance: 1000,
    user: { connect: { id: userId } },
  }
  await prisma.account
    .create({
      data: account,
    })
    .then((data) => {
      console.log('account', data)
      return data
    })
}

const addCategory = async () => {
  await prisma.category
    .create({
      data: {
        name: 'test',
      },
    })
    .then((data) => {
      console.log('category', data)
      return data
    })
}

const addGroup = async () => {
  const group: Prisma.GroupCreateInput = {
    name: 'Personal',
    description: 'Personal transactions',
    isDefault: true,
    admin: {
      connect: {
        id: userId,
      },
    },
  }
  await prisma.group
    .create({
      data: {
        ...group,
        members: {
          create: {
            id: userId,
          },
        },
      },
    })
    .then((data) => {
      console.log('group', data)
      return data
    })
}

export { router as playgroundRouter }
