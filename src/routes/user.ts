import { Router } from 'express'
import prisma from '../../prisma/client.js'
import { Request, Response } from 'express'
import { defaultCategories } from '../utils/defaultCategories.js'

const router = Router()

const UserModule = {
  async getUser(req: Request, res: Response) {
    const { id } = res.locals.user
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) return res.status(404).send({ message: 'User not found' })
    const response = {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      doneSetup: user.doneSetup,
    }
    return res.send(response)
  },

  async setupUser(req: Request, res: Response) {
    const response: Record<any, any> = {}
    try {
      const { id } = res.locals.user

      const userData = await prisma.user.findUnique({
        where: {
          id,
        },
      })

      if (userData.doneSetup) {
        return res.send({
          success: true,
          data: {
            id: userData.id,
            email: userData.email,
            role: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar,
            doneSetup: userData.doneSetup,
          },
          error: null,
        })
      }

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
          data: defaultCategories,
        })

        response['personal'] = personal
        response['shared'] = shared
        response['account'] = account
        response['categories'] = categories
      })

      const user = await prisma.user.update({
        where: {
          id,
        },
        data: {
          doneSetup: true,
        },
      })

      return res.send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar,
          doneSetup: user.doneSetup,
        },
        error: null,
      })
    } catch (err) {
      console.log('ERR', err)
      return res.send({
        data: response,
        error: err,
      })
    }
  },
}

//TODO: add routes
router.get('/', UserModule.getUser)
router.patch('/setup', UserModule.setupUser)

export { router as userRouter }
