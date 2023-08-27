import { Request, Response } from 'express'
import { getUserByEmail } from '../db/user.js'

const getUser = async (req: Request, res: Response) => {
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
      }
      return res.send(response)
    }
  } catch (err) {
    console.log(err)
  }
  return res.status(404).send({ message: 'User not found' })
}

export { getUser }
