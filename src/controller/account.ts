import { Request, Response } from 'express'
import { addAccounts, getAccounts } from '../db/account.js'
import { Prisma } from '@prisma/client'

export const get = async (_req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const response = await getAccounts(id)
    return res.send({
      success: true,
      message: 'Accounts fetched successfully',
      data: response,
    })
  } catch (err) {
    console.log('ERR', err)
    return res.boom.badRequest('Failed to fetch accounts', { success: false, err })
  }
}

export const add = async (req: Request, res: Response) => {
  try {
    const body = req.body
    const accountObject: Prisma.AccountCreateManyInput[] = []
    if (body.length === 0) return res.boom.badRequest('No accounts to add', { success: false })
    try {
      body.forEach((account: any) => {
        const item: Prisma.AccountCreateManyInput = {
          name: account.name,
          type: account.type,
          balance: account.balance,
          userId: res.locals.user.id,
        }
        accountObject.push(item)
      })
    } catch (err) {
      console.log(err)
      return res.boom.badRequest('Invalid data received', { success: false, err })
    }
    const response = await addAccounts(accountObject)
    return res.send({
      success: true,
      data: response,
      message: 'Account added successfully',
    })
  } catch (err) {
    console.log('ERR', err)
    return res.boom.badRequest('Failed to add accounts', { success: false, err: JSON.stringify(err) })
  }
}
