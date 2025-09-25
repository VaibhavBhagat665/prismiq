/** Auth routes for demo login */
import express from 'express'
import { getFirestore } from 'firebase-admin/firestore'

const router = express.Router()
const db = getFirestore()

// Demo login endpoint
router.post('/auth/demo-login', async (req, res) => {
  try {
    // Create or get demo user
    const demoUserId = 'demo-user-123'
    const demoUserRef = db.collection('users').doc(demoUserId)
    
    const demoUserData = {
      name: 'Demo User',
      email: 'demo@prismiq.com',
      age: 25,
      degree: 'Computer Science',
      college: 'Demo University',
      interests: ['AI/ML', 'Web Development', 'Data Science'],
      createdAt: new Date(),
      isDemo: true
    }
    
    await demoUserRef.set(demoUserData, { merge: true })
    
    res.json({
      success: true,
      user: {
        uid: demoUserId,
        ...demoUserData
      }
    })
  } catch (error) {
    console.error('Demo login error:', error)
    res.status(500).json({ error: 'Demo login failed' })
  }
})

export { router as authRouter }
