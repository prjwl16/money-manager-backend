import config from 'config'
import twilio from 'twilio'

export const sendMessage = async (message: string, to: string) => {
  try {
    const accountSid = config.get('twilio.accountSid') as string
    const authToken = config.get('twilio.authToken') as string
    const client = twilio(accountSid, authToken)
    const response = await client.messages.create({
      from: 'whatsapp:+14155238886', // From a valid Twilio number
      body: message,
      to: 'whatsapp:+' + to, // Text this number
    })
    console.log(response)
    return response
  } catch (err) {
    console.log(err)
  }
}
