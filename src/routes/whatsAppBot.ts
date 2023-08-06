import { Request, Response, Router } from 'express'
import process from 'process'
import { default as axios } from 'axios'
const whatsApp = Router()

const handleWhatsAppCallback = async (req: Request, res: Response) => {
  const getExpenseJsonFromNatualLanguage = async (prompt: string) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: `Assume you are adding expenses in your Database. Now, provide me json of this format {action:"expense or income", date: get it from sentence if not present then give today\'s ", amount:(number), currency: (INR, if not mentioned in sentence) }. from following sentence:  ${prompt}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.TOKEN}`,
      },
      data: data,
    }

    const response = await axios.request(config)
    try {
      if (response) {
        return response.data.choices[0].message.content
      }
    } catch (e) {
      console.log('Error: ', e)
      throw new Error('Error converting text to JSON')
    }
  }

  const { Body, ProfileName, WaId } = req.body
  try {
    const json = await getExpenseJsonFromNatualLanguage(Body)
    console.log('req.body', json)
  } catch (e) {
    console.log('Error: ', e)
    res.sendStatus(400)
  }

  res.sendStatus(200)
}

whatsApp.post('/callback/whatsApp', handleWhatsAppCallback)
export default whatsApp
