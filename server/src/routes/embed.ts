import { Router } from 'express'
import Joi from 'joi'
import { callMl } from '../services/mlClient.js'

export const embedRouter = Router()

embedRouter.post('/embed', async (req, res) => {
  const schema = Joi.object({ text: Joi.string().min(1).required() })
  const { error, value } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })
  const data = await callMl('/embed', value)
  return res.json(data)
})
