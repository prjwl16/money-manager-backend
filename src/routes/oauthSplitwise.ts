import { Router } from 'express'
import { handleSplitwiseCallBack } from '../controller/oauthController.js'
import config from 'config'

const router = Router()

const server: string = config.get('host')
const clientId: string = config.get('sw.consumerKey')
const redirectUri: string = server + config.get('sw.callbackPath')
const authUrl: string = config.get('sw.authUrl')

const getAuthUrl = (clientId: string, redirectUri: string) => {
  return `${authUrl}?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
}

router.get('/', (_req, res) => {
  const authorizationUrl = getAuthUrl(clientId, redirectUri)
  res.redirect(authorizationUrl)
})

router.get('/callback', handleSplitwiseCallBack)

export { router as splitwiseRouterAuth }
