import { Request, Response } from 'express'
import { fetchExpenses, fetchFriend, fetchFriends, fetchGroups } from '../APIs/splitwise/expenses.js'

export const getExpenses = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { splitwiseUserId, splitwiseAccessToken } = user

  const response = await fetchExpenses(splitwiseAccessToken, splitwiseUserId)

  return res.send(response)
}

export const getFriends = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { splitwiseUserId, splitwiseAccessToken } = user

  const response = await fetchFriends(splitwiseAccessToken, splitwiseUserId)

  return res.send(response)
}

export const getGroups = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { splitwiseUserId, splitwiseAccessToken } = user

  const response = await fetchGroups(splitwiseAccessToken, splitwiseUserId)

  return res.send(response)
}

export const getFriend = async (req: Request, res: Response) => {
  const { user } = res.locals
  const { splitwiseUserId, splitwiseAccessToken } = user
  const response = await fetchFriend(splitwiseAccessToken, splitwiseUserId, splitwiseUserId)

  return res.send(response)
}
