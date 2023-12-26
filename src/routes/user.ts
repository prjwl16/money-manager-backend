import { Router } from 'express'
import prisma from '../prisma/client.js'
import { Request, Response } from 'express'

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
        response['account'] = account
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
