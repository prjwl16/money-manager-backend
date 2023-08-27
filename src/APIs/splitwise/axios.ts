import axios from 'axios'
const baseUrl = 'https://secure.splitwise.com/api/v3.0'

const swApi = (accessToken: string) => {
  const instance = axios.create({
    baseURL: baseUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })

  return instance
}

export default swApi
