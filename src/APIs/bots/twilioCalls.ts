import config from 'config'
import twilio from 'twilio'

const accountSid = config.get('twilio.accountSid') as string
const authToken = config.get('twilio.authToken') as string

const client = twilio(accountSid, authToken)
