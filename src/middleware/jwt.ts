import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import logger from '../utils/logger.js'

const secret: string = process.env.SECRET_KEY || 'nodeSecret'

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const bearerHeader = req.headers['authorization']
  if (typeof bearerHeader !== 'undefined') {
    const token = bearerHeader.split(' ')[1]
    console.log('token: ', bearerHeader)
    try {
      const data = jwt.verify(token, secret)
      res.locals = {
        data,
      }
    } catch (err) {
      logger.error(err)
      res
        .send({
          error: 'Invalid token provided',
        })
        .status(403)
    }
    next()
  } else {
    res
      .send({
        error: 'Token not provided',
      })
      .status(403)
  }
}

export const createToken = (id: string, email?: string, phone?: string, role?: string) => {
  try {
    const payload = {
      id,
      email,
      role,
    }
    const token = jwt.sign(payload, secret, {
      expiresIn: '30d',
    })
    return token
  } catch (e) {
    logger.error(e)
    throw Error('token')
  }
}
