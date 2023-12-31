import { Request, Response, Router } from 'express'

import { handleWhatsAppCallback } from '../APIs/bots/whatsApp.js'
const whatsApp = Router()

const WatsAppHandler = async (req: Request, res: Response) => {
  try {
    const prompt = req.body.Body
    await handleWhatsAppCallback(prompt)
  } catch (e) {
    console.log('Here is the error', e)
  }
  return res.sendStatus(200)
}

whatsApp.post('/', WatsAppHandler)
export default whatsApp
