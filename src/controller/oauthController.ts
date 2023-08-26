import { Request, Response } from 'express'
import { createToken } from '../middleware/jwt'
import axios from 'axios'
import { createUser, getUserByEmail, updateUser } from '../db/user'
import { getCurrentUser } from '../APIs/splitwise/user'

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

export const handleSplitwiseCallBack = async (req: Request, res: Response) => {
  const code = req.query.code

  const clientId = process.env.SPLITWISE_CONSUMER_KEY || ''
  const clientSecret = process.env.SPLITWISE_CONSUMER_SECRET || ''
  const redirectUri = (SERVER_URL || '') + process.env.SPLITWISE_CALLBACK_PATH
  const swTokenUrl = process.env.SPLITWISE_TOKEN_URL || ''

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
      const userObjFromSw = {
        email: email,
        splitwiseUserId: swUser.id,
        firstName: swUser.first_name,
        lastName: swUser.last_name,
        avatar: swUser.picture.small,
        splitwiseAccessToken: accessToken,
      }
      return await createUser(userObjFromSw).catch((err) => {
        console.log('Error creating new user from splitwise: ', err)
        return null
      })
    }

    //update user
    return await updateUser({ email }, { splitwiseUserId: id, splitwiseAccessToken: accessToken }).catch((err) => {
      console.log('Error updating user from splitwise: ', err)
      return null
    })
  } catch (err) {
    console.log('ERR calling SW', err)
    return null
  }
}
