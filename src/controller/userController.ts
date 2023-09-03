import { Request, Response } from 'express'
import { getUserByEmail, updateNewUserSetup } from '../db/user.js'
import { addAccounts } from '../db/account.ts'
import { Prisma } from '@prisma/client'
import prisma from '../../prisma/client.ts'
import { createGroup } from '../db/group.ts'

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
  console.log('Here: ', req.body)
  try {
    prisma
      .$transaction(async () => {
        const { accountName, balance } = req.body.account
        const accountObject: Prisma.AccountCreateInput = {
          name: accountName,
          type: 'BANK',
          balance: balance || 0,
          isDefault: true,
        }
        await addAccounts([accountObject])
        const user = await updateNewUserSetup(id)

        const { name, description } = req.body.group

        await createGroup(id, name, description)

        return res.send({
          success: true,
          data: user,
          message: 'Setup done..!',
        })
      })
      .catch((err) => {
        console.log('Err: ', err)
        throw Error('Failed to update DB' + err)
      })
  } catch (err) {
    console.log(err)
    return res.boom.badRequest('Failed to mark done', { success: false, err })
  }
}
