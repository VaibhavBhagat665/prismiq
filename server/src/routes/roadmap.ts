import { Router } from 'express'
import { callMl } from '../services/mlClient.js'
import { writeRoadmap } from '../services/firestore.js'

export const roadmapRouter = Router()

roadmapRouter.get('/roadmap', async (req, res) => {
  const career = String(req.query.career || '')
  if (!career) return res.status(400).json({ error: 'career required' })
  const data = await callMl('/roadmap', { career })
  await writeRoadmap(data)
  return res.json(data)
})
