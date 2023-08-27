import { Request, Response, Router } from 'express'

import { createUser, getUserByEmail, getUserByPhone, validateUser } from '../db/user.js'
import { success } from '../../constants/success.js'
import logger from '../utils/logger.js'
import { createToken } from '../middleware/jwt.js'
import { errors } from '../../constants/errors.js'
import {
  addSignUpValidation,
  signUpValidate,
  singInValidate,
  validateRequest,
} from '../middleware/validator/RequestValidator.js'

const authRouter = Router()

const singIn = async (req: Request, res: Response) => {
  const { email, phone, password } = req.body
  let user
  if (email) {
    user = await getUserByEmail(email)
  } else if (phone) {
    user = await getUserByPhone(phone)
  }
  if (user != null) {
    const isAuthenticated = await validateUser(password, user.password || '')
    //create token
    if (isAuthenticated) {
      const token = createToken(user.id, user.email || '', user.phone || '')
      res.send({
        id: user.id,
        phone: user.phone || undefined,
        email: user.email || undefined,
        token,
      })
    }
  }
  return res.status(406).send(errors.USER_NOT_FOUND)
}

const singUp = async (req: Request, res: Response) => {
  const user = {
    email: req.body.email,
    phone: req.body.phone,
    password: req.body.password,
  }

  try {
    const newUser = await createUser(user)
    if (newUser == null) throw new Error('DB_CREATE')
    const token = createToken(newUser.id || '', newUser.email || '', newUser.phone || '')
    return res.status(201).send({ ...success.USER_CREATED, token })
  } catch (e) {
    logger.error('Failed to create user: ' + JSON.stringify(user))
    if (e == 'token') return res.status(402).send(errors.TOKEN_CREATION)
    else if (e == 'DB_CREATE') if (e == 'token') return res.status(402).send(errors.USER_CREATION_FAIELD)
    return res.status(402).send(errors.SOMETHING_WENT_WRONG)
  }
}

authRouter.post('/sign-up', addSignUpValidation, validateRequest, signUpValidate, singUp)
authRouter.post('/sign-in', singInValidate, validateRequest, singIn)

export default authRouter
