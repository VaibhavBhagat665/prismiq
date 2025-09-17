import { Router } from 'express'
import Joi from 'joi'
import { callMl } from '../services/mlClient.js'
import { writeRecommendations } from '../services/firestore.js'

export const recommendRouter = Router()

recommendRouter.post('/recommend', async (req, res) => {
  const schema = Joi.object({ profile: Joi.object().unknown(true).required() })
  const { error, value } = schema.validate(req.body)
  if (error) return res.status(400).json({ error: error.message })
  const data = await callMl('/recommend', value)
  await writeRecommendations(data)
  return res.json(data)
})
