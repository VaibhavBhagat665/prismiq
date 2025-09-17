/** Express API gateway for Prismiq */
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import pino from 'pino'
import multer from 'multer'
import { recommendRouter } from './routes/recommend.js'
import { roadmapRouter } from './routes/roadmap.js'
import { chatRouter } from './routes/chat.js'
import { embedRouter } from './routes/embed.js'
import { initFirestore } from './services/firestore.js'

dotenv.config()
const app = express()
const logger = pino({ level: 'info' })

app.use(cors())
app.use(helmet())
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true }))

initFirestore()

app.get('/healthz', (_req, res) => res.json({ ok: true }))

app.use('/api', recommendRouter)
app.use('/api', roadmapRouter)
app.use('/api', chatRouter)
app.use('/api', embedRouter)

const upload = multer({ dest: '/tmp' })
app.post('/api/upload-resume', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' })
  // In prototype, just echo a few fake parsed skills
  return res.json({ skills: ['python', 'sql', 'ml'] })
})

const port = Number(process.env.PORT || 4000)
const server = app.listen(port, () => logger.info({ msg: 'server_started', port }))

process.on('SIGINT', () => { server.close(() => process.exit(0)) })
process.on('SIGTERM', () => { server.close(() => process.exit(0)) })
