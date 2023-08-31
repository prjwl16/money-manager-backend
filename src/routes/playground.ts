import { Router } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: [{ level: 'query', emit: 'event' }],
})

prisma.$on('query', (e) => {
  console.log(e)
})

const router = Router()

interface Account {
  name: string
  type: 'CASH' | 'BANK' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'LOAN'
  balance: number
}
interface Group {
  name: string
  description: string
  createdBy: string
}

interface transaction {
  particular: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  date: Date
}

let userId = 'ead9c725-55f6-4cfa-b27b-c2632f32480f'
let accountId = '14e7a172-ffa3-4184-bc8b-cc27a546b804'
let groupId = '045b2fdb-9789-4492-b5fb-1ccdbc710533'
let categoryId = '7f03ef5b-c3cd-486a-b87a-d5a779174e8d'

router.get('/add', async (req, res) => {
  let response: Record<any, any> = {}

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
  let response: Record<any, any> = {}

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
        usersInTransactions: {
          include: {
            user: true,
          },
        },
      },
    })
    .then((data) => {
      console.log('transaction', data)
      return data
    })
}

const addTransaction = async () => {
  const transaction: transaction = {
    type: 'EXPENSE',
    particular: 'Mehenga transaction',
    amount: 100000,
    date: new Date(),
  }

  await prisma.transaction
    .create({
      data: {
        type: 'EXPENSE',
        particular: transaction.particular,
        amount: transaction.amount,
        date: transaction.date,
        accountId: accountId,
        paidById: userId,
        createdById: userId,
        updatedByIds: [userId],
        categoryId: categoryId,
        usersInTransactions: {
          create: {
            user: {
              connect: {
                id: userId,
              },
            },
            splitShare: transaction.amount,
          },
        },
        groupId: groupId,
      },
    })
    .then((data) => {
      console.log('transaction', data)
      return data
    })
}

const addAccount = async () => {
  const account: Account = {
    name: 'test',
    type: 'CREDIT_CARD',
    balance: 1000,
  }
  await prisma.account
    .create({
      data: {
        ...account,
        user: { connect: { id: userId } },
      },
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
        title: 'test',
        description: 'test',
      },
    })
    .then((data) => {
      console.log('category', data)
      return data
    })
}

const addGroup = async () => {
  const group: Group = {
    name: 'test',
    description: 'test',
    createdBy: userId,
  }
  await prisma.groups
    .create({
      data: {
        ...group,
        userInGroups: {
          create: {
            userId: userId,
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
