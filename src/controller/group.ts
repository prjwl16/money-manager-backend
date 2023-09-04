import { Request, Response } from 'express'
import { addUserToGroup, getGroupByUserId } from '../db/group.js'

export const get = async (_req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const response = await getGroupByUserId(id)
    return res.send({
      success: true,
      data: response,
      message: 'Groups fetched successfully',
    })
  } catch (err) {
    return res.boom.badRequest('Failed to get groups', { success: false, err })
  }
}
export const addUserToTheGroup = async (req: Request, res: Response) => {
  try {
    const { id } = res.locals.user
    const { groupId } = req.params
    const response = await addUserToGroup(id, Number(groupId))
    return res.send({
      success: true,
      data: response,
      message: 'User added to group successfully',
    })
  } catch (err) {
    console.log(err)
    return res.boom.badRequest('Failed to add user to group', { success: false, err })
  }
}
