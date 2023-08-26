import { Request, Response } from 'express'
import { createToken } from '../middleware/jwt.js'

const SERVER_URL = process.env.SERVER_URL
const FRONTEND_URL = process.env.FRONTEND_URL

export const handleGoogleCallBack = async (req: Request, res: Response) => {
  //create jwt token
  if (req.user) {
    const user = JSON.parse(JSON.stringify(req.user))
    const token = createToken(user.id, user.email, user.phone, user.role)
    res.redirect(`${FRONTEND_URL}?token=${token}`)
  }
  res.redirect(`${FRONTEND_URL}`)
}
