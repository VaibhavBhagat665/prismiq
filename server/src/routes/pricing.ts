/** Pricing API routes */
import express from 'express'

const router = express.Router()

// Get pricing tiers
router.get('/pricing', async (req, res) => {
  try {
    const pricingTiers = {
      tiers: [
        {
          id: 'free',
          name: 'Free',
          price: 0,
          period: 'month',
          features: [
            'Basic career recommendations',
            'Limited AI chat (10 messages/month)',
            'Resume analysis (1 per month)',
            'Basic skills roadmap'
          ],
          limits: {
            chatMessages: 10,
            resumeAnalysis: 1,
            recommendations: 5
          }
        },
        {
          id: 'pro',
          name: 'Pro',
          price: 19,
          period: 'month',
          features: [
            'Unlimited career recommendations',
            'Unlimited AI chat',
            'Unlimited resume analysis',
            'Advanced skills roadmap',
            'Priority support',
            'Career tracking dashboard'
          ],
          limits: {
            chatMessages: -1,
            resumeAnalysis: -1,
            recommendations: -1
          },
          popular: true
        },
        {
          id: 'premium',
          name: 'Premium',
          price: 49,
          period: 'month',
          features: [
            'Everything in Pro',
            '1-on-1 career coaching sessions',
            'Custom learning paths',
            'Industry insider insights',
            'Job application tracking',
            'Salary negotiation guidance'
          ],
          limits: {
            chatMessages: -1,
            resumeAnalysis: -1,
            recommendations: -1,
            coachingSessions: 2
          }
        }
      ]
    }
    
    res.json(pricingTiers)
  } catch (error) {
    console.error('Pricing fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch pricing' })
  }
})

export { router as pricingRouter }
