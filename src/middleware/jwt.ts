import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'
import { getUserByEmail } from '../db/user.js'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bearerHeader = req.headers['authorization']
    if (typeof bearerHeader !== 'undefined') {
      const token = bearerHeader.split(' ')[1]
      try {
        const data = jwt.verify(token, 'secret')
        if (typeof data === 'string') throw Error('Invalid token provided')
        const user = await getUserByEmail(data.email)
        res.locals = {
          user,
        }
      } catch (err) {
        logger.error(err)
        return res.boom.badData('Invalid token provided')
      }
      next()
    } else {
      res.boom.badData('Token not provided')
    }
  } catch (err) {
    res.boom.badImplementation()
  }
}

export const createToken = (id: string, email?: string | null, phone?: string | null, role?: string) => {
  try {
    const payload = {
      id,
      email,
      role,
    }
    const token = jwt.sign(payload, 'secret', {
      expiresIn: '30d',
    })
    return token
  } catch (e) {
    logger.error(e)
    throw Error('token')
  }
}
