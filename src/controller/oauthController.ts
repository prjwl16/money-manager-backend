import { Request, Response } from 'express'
import config from 'config'
import { createToken } from '../middleware/jwt.js'
import axios from 'axios'
import { createUser, getUserByEmail, updateUser } from '../db/user.js'
import { getCurrentUser } from '../APIs/splitwise/user.js'
import { Prisma } from '@prisma/client'

const FRONTEND_URL: URL = config.get('frontend.base')
const TOKEN_REDIRECT: string = config.get('frontend.tokenRedirect')
const host: string = config.get('host')

export const handleGoogleCallBack = async (req: Request, res: Response) => {
  //create jwt token
  if (req.user) {
    const user = JSON.parse(JSON.stringify(req.user))
    const token = createToken(user.id, user.email, user.phone, user.role)
    res.redirect(`${FRONTEND_URL + TOKEN_REDIRECT}?token=${token}`)
  }
  res.redirect(`${FRONTEND_URL}`)
}

export const handleSplitwiseCallBack = async (req: Request, res: Response) => {
  try {
    const code = req.query.code

    const clientId: string = config.get('sw.consumerKey')
    const clientSecret: string = config.get('sw.consumerSecret')
    const redirectUri: string = host + config.get('sw.callbackPath')
    const swTokenUrl: string = config.get('sw.tokenUrl')

    const tokenResponse = await axios.post(swTokenUrl, null, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
        code: code,
      },
    })

    const { access_token } = tokenResponse.data
    const user = await handleSplitwiseUserCreation(access_token)

    if (user) {
      const token = createToken(user.id, user.email, user.phone, user.role)
      res.redirect(`${FRONTEND_URL}?token=${token}`)
    }

    res.redirect(`${FRONTEND_URL}/failed`)
  } catch (err) {
    console.log('ERR handling splitwise callback', err)
    res.redirect(`${FRONTEND_URL}/failed`)
  }
}

const handleSplitwiseUserCreation = async (accessToken: string) => {
  try {
    const response = await getCurrentUser(accessToken) //get current user from splitwise using access token

    if (!response.data.user) {
      console.log('No user in response from SW')
      return null
    }

    console.log('Response from SW get current token: ', response.data.user)

    const { email, id } = response.data.user
    const user = await getUserByEmail(email)

    if (!user) {
      const swUser = response.data.user
      const userObjFromSw: Prisma.UserCreateInput = {
        email: email,
        swUserId: swUser.id,
        firstName: swUser.first_name,
        lastName: swUser.last_name,
        avatar: swUser.picture.small,
        swAccessToken: accessToken,
      }
      return await createUser(userObjFromSw).catch((err: any) => {
        console.log('Error creating new user from splitwise: ', err)
        return null
      })
    }

    //update user
    return await updateUser({ email }, { swUserId: id, swAccessToken: accessToken }).catch((err: any) => {
      console.log('Error updating user from splitwise: ', err)
      return null
    })
  } catch (err) {
    console.log('ERR calling SW', err)
    return null
  }
}
