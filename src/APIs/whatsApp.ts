import process from 'process'
import { default as axios } from 'axios'

export const handleWhatsAppCallback = async (prompt: string) => {
  try {
    const response = await _hitOpenAI(prompt)
    console.log('response', JSON.stringify(response.data.choices[0]))
    return
  } catch (e) {
    console.log('Error: ', e)
    return
  }
}

const _hitOpenAI = async (prompt: string) => {
  const testPrompt = `
    You are building an expense manager app with a WhatsApp bot that converts user messages into JSON format.

    You should provide the following instructions:

    1. Ask the user to input their expense or income in the format: "I [action] [particular] of [amount] [currency]."
    For example, "I bought tomato of 50 RS." or "I got my salary of 20k today."

    2. If the user doesn't mention a date, assume today's date as the default in the format DD-MM-YYYY.

    3. Extract the following elements from the user input:
      - amount (numeric value)
      - currency (textual representation of currency)
      - action (either "expense" or "income")
      - date (in DD-MM-YYYY format, use today's date if not mentioned)
      - particular (the item or reason for the transaction)

    4. Use this information to generate a JSON object with the extracted data.

    Please make sure the generated JSON adheres to this structure:
    {
      "amount": [amount],
      "currency": "[currency]",
      "action": "[action]",
      "date": "[date]",
      "particular": "[particular]"
    }

    Remember to handle variations in user input and provide a clear JSON output for each message.
    ${prompt}`

  const data = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'user',
        content: testPrompt,
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

  return await axios.request(config)
}
