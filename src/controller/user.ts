import { Request, Response } from 'express'
import { getUserByEmail } from '../db/user.js'
import { Prisma } from '@prisma/client'
import prisma from '../../prisma/client.js'

export const get = async (_req: Request, res: Response) => {
  try {
    const { email } = res.locals.user
    if (email) {
      const user = await getUserByEmail(email)
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
    }
  } catch (err) {
    return res.boom.badRequest('User not found', { success: false })
  }
  return res.boom.badRequest('User not found', { success: false })
}

export const newUserSetUp = async (req: Request, res: Response) => {
  const { id } = res.locals.user
  try {
    prisma
      .$transaction(async (tx) => {
        const { accountName, balance } = req.body.account
        const accountObject: Prisma.AccountCreateInput = {
          name: accountName,
          type: 'BANK',
          balance: balance || 0,
          isDefault: true,
          user: { connect: { id: id } },
        }
        await tx.account.create({ data: accountObject })

        const user = await tx.user.update({ where: { id: id }, data: { doneSetup: true } })

        const { name, description } = req.body.group

        await tx.group.create({
          data: {
            name: name,
            description: description,
            isDefault: true,
            members: {
              connect: {
                id: id,
              },
            },
            admin: {
              connect: {
                id: id,
              },
            },
          },
        })
        return res.send({
          success: true,
          data: user,
          message: 'Setup done..!',
        })
      })
      .catch((err) => {
        console.log(err)
        throw Error('Failed to update DB' + err)
      })
  } catch (err) {
    console.log(err)
    return res.boom.badRequest('Failed to mark done', { success: false, err })
  }
}
