import { Router } from 'express'
import { Prisma, PrismaClient } from '@prisma/client'
import prisma from '../../prisma/client.js'

const router = Router()

router.get('/', async (_req, res) => {
  const response: Record<any, any> = {}
  try {
    //set account :TODO
    //create default groups
    // 1. _PRSNL
    // 2. _SHARED

    const { id } = res.locals.user

    await prisma.$transaction(async (txn) => {
      const personal = await txn.group.create({
        data: {
          name: '_PRSNL',
          isDefault: true,
          adminId: id,
          UserGroup: {
            create: {
              userId: id,
            },
          },
        },
      })

      const shared = await txn.group.create({
        data: {
          name: '_SHARED',
          isDefault: false,
          adminId: id,
          UserGroup: {
            create: {
              userId: id,
            },
          },
        },
      })

      //Create account
      const account = await txn.account.create({
        data: {
          name: 'Bank',
          type: 'BANK',
          balance: 0,
          isDefault: true,
          userId: id,
        },
      })

      const categories = await txn.category.createMany({
        data: [
          {
            name: 'Food',
          },
          {
            name: 'Travel',
          },
          {
            name: 'Shopping',
          },
          {
            name: 'Entertainment',
          },
          {
            name: 'Bills',
          },
          {
            name: 'Others',
          },
        ],
      })

      response['personal'] = personal
      response['shared'] = shared
      response['account'] = account
      response['categories'] = categories
    })

    return res.send({
      data: response,
      error: null,
    })
  } catch (err) {
    console.log('ERR', err)
    return res.send({
      data: response,
      error: err,
    })
  }
})

export { router as playgroundRouter }
