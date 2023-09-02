import { Request, Response } from 'express'
import { getUserByEmail, markDone } from '../db/user.js'

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

export const constMarkDone = async (_req: Request, res: Response) => {
  const { id } = res.locals.user
  try {
    await markDone(id)
    return res.send({
      success: true,
      message: 'User marked done successfully',
      data: {},
    })
  } catch (err) {
    console.log(err)
    return res.boom.badRequest('Failed to mark done', { success: false, err })
  }
}
