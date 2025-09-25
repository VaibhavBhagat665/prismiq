import { Router, Request, Response } from 'express'
import Joi from 'joi'
import { callMLService } from '../services/mlClient.js'
import { db } from '../services/firebase.js'

const router = Router()
export { router as recommendRouter }

router.post('/recommend', async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({ 
      profile: Joi.object().unknown(true).required(),
      userId: Joi.string().required()
    })
    const { error, value } = schema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    
    // Call ML service for recommendations
    const mlResponse = await callMLService('/recommend', {
      user_profile: value.profile,
      user_id: value.userId
    })
    
    // Save recommendations to Firestore
    const recommendationDoc = {
      recommendations: mlResponse.recommendations || [],
      profile: value.profile,
      generatedAt: new Date(),
      source: 'ml_service'
    }
    
    await db.collection('users').doc(value.userId)
      .collection('recommendations').add(recommendationDoc)
    
    return res.json({ recommendations: mlResponse.recommendations || [] })
  } catch (error) {
    console.error('Recommendation error:', error)
    return res.status(500).json({ error: 'Failed to generate recommendations' })
  }
})
