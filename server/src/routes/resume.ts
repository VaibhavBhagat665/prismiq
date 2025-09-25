/** Resume upload and processing routes */
import { Router, Request, Response } from 'express'
import multer from 'multer'
import pdfParse from 'pdf-parse'
import { callMLService } from '../services/mlClient.js'
import { db } from '../services/firebase.js'
import fs from 'fs'

const router = Router()
export { router as resumeRouter }

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }
})

// Upload and process resume
router.post('/upload-resume', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File required' })
    }

    const { userId } = req.body
    if (!userId) {
      return res.status(400).json({ error: 'User ID required' })
    }

    let parsedText = ''
    
    // Parse file based on type
    if (req.file.mimetype === 'application/pdf') {
      const dataBuffer = fs.readFileSync(req.file.path)
      const pdfData = await pdfParse(dataBuffer)
      parsedText = pdfData.text
    } else {
      // For text files
      parsedText = fs.readFileSync(req.file.path, 'utf8')
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path)

    // Send to ML service for processing
    const mlResponse = await callMLService('/process_resume', {
      resume_text: parsedText,
      user_id: userId
    })

    // Save extracted skills to Firestore
    const skillsDoc = {
      skills: mlResponse.skills || [],
      parsedText: parsedText.substring(0, 500), // Store snippet
      fileName: req.file.originalname,
      processedAt: new Date(),
      analysis: mlResponse.analysis || {}
    }

    await db.collection('users').doc(userId)
      .collection('resumeSkills').add(skillsDoc)

    res.json({
      skills: mlResponse.skills || [],
      parsedTextSnippet: parsedText.substring(0, 200),
      analysis: mlResponse.analysis || {}
    })

  } catch (error) {
    console.error('Resume upload error:', error)
    res.status(500).json({ error: 'Resume processing failed' })
  }
})
