import { Router } from 'express'
import Joi from 'joi'
import { callMl } from '../services/mlClient.js'
import { writeChatMessage } from '../services/firestore.js'

export const chatRouter = Router()

chatRouter.post('/chat', async (req, res) => {
  const schema = Joi.object({ message: Joi.string().min(1).required(), lang: Joi.string().optional(), user_id: Joi.string().default('demo-user') })
  const { error, value } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })
  await writeChatMessage({ role: 'user', text: value.message })
  const data = await callMl('/chat', value)
  await writeChatMessage({ role: 'assistant', text: data.reply })
  return res.json(data)
})
