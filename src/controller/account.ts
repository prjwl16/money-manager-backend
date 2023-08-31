import { Request, Response } from 'express'
import { addAccount, getAccounts } from '../db/account.js'
import config from 'config'

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
    const accountObject = {
      name: body.name,
      userId: res.locals.user.id,
      type: body.type,
      balance: body.balance,
    }
    const response = await addAccount(accountObject)
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
