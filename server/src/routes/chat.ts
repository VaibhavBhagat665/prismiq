import { Router, Request, Response } from 'express'
import Joi from 'joi'
import { callMLService } from '../services/mlClient.js'
import { db } from '../services/firebase.js'

const router = Router()
export { router as chatRouter }

router.post('/chat', async (req: Request, res: Response) => {
  try {
    const schema = Joi.object({ 
      message: Joi.string().min(1).required(), 
      lang: Joi.string().default('en'),
      userId: Joi.string().required(),
      userProfile: Joi.object().optional()
    })
    const { error, value } = schema.validate(req.body)
    if (error) return res.status(400).json({ error: error.message })
    
    // Save user message to Firestore
    const userMessageDoc = {
      role: 'user',
      content: value.message,
      timestamp: new Date(),
      lang: value.lang
    }
    
    await db.collection('users').doc(value.userId)
      .collection('chats').add(userMessageDoc)
    
    // Call ML service for chat response
    const mlResponse = await callMLService('/chat', {
      message: value.message,
      user_profile: value.userProfile || {},
      lang: value.lang,
      user_id: value.userId
    })
    
    // Save assistant response to Firestore
    const assistantMessageDoc = {
      role: 'assistant',
      content: mlResponse.reply || 'I apologize, but I encountered an error processing your request.',
      timestamp: new Date(),
      sources: mlResponse.sources || [],
      lang: value.lang
    }
    
    await db.collection('users').doc(value.userId)
      .collection('chats').add(assistantMessageDoc)
    
    return res.json({
      reply: mlResponse.reply || 'I apologize, but I encountered an error processing your request.',
      sources: mlResponse.sources || []
    })
  } catch (error) {
    console.error('Chat error:', error)
    return res.status(500).json({ error: 'Chat processing failed' })
  }
})
