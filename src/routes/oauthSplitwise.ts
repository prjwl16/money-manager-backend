import { Router } from 'express'
import axios from 'axios'
import { handleSplitwiseCallBack } from '../controller/oauthController.js'

const router = Router()

const clientId = process.env.SPLITWISE_CONSUMER_KEY || ''
const redirectUri = process.env.SPLITWISE_CALLBACK_PATH || ''
const authUrl = process.env.SPLITWISE_AUTHORIZE_URL || ''

const getAuthUrl = (clientId: string, redirectUri: string) => {
  return `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
}

router.get('/', (_req, res) => {
  console.log('Here: ')
  const authorizationUrl = getAuthUrl(clientId, redirectUri)
  console.log(authorizationUrl)
  res.redirect(authorizationUrl)
})

router.get('/callback', handleSplitwiseCallBack)

export { router as splitwiseRouter }
