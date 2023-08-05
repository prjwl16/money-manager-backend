import { Request, Response } from 'express'
import prisma from '../prisma/client.js'

const router = require('express').Router()

const singUp = async (req: Request, res: Response) => {}

const singIn = async (req: Request, res: Response) => {}

const validateEmailAndPassword = []

router.post('/singUp', singUp)
router.post('/singIn', singIn)

module.exports = router
