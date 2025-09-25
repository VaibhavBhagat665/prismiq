import { Router, Request, Response } from 'express'
import Joi from 'joi'
import { callMLService } from '../services/mlClient'
import { getFirestore } from 'firebase-admin/firestore'

const router = Router()
export { router as roadmapRouter }
const db = getFirestore()

router.get('/roadmap', async (req: Request, res: Response) => {
  try {
    const career = String(req.query.career || '')
    const userId = String(req.query.userId || '')
    
    if (!career) return res.status(400).json({ error: 'career required' })
    if (!userId) return res.status(400).json({ error: 'userId required' })
    
    // Call ML service for roadmap
    const mlResponse = await callMLService('/roadmap', { 
      career_name: career,
      user_id: userId 
    })
    
    // Save roadmap to Firestore
    const careerSlug = career.toLowerCase().replace(/\s+/g, '-')
    const roadmapDoc = {
      career,
      roadmap: mlResponse.roadmap || {},
      phases: mlResponse.phases || [],
      generatedAt: new Date(),
      source: 'ml_service'
    }
    
    await db.collection('users').doc(userId)
      .collection('roadmaps').doc(careerSlug).set(roadmapDoc)
    
    return res.json(mlResponse)
  } catch (error) {
    console.error('Roadmap error:', error)
    return res.status(500).json({ error: 'Failed to generate roadmap' })
  }
})
