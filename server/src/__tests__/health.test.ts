import request from 'supertest'
import express from 'express'
import { fileURLToPath } from 'url'

// Spin a minimal app exposing /healthz
const app = express()
app.get('/healthz', (_req, res) => res.json({ ok: true }))

test('healthz ok', async () => {
  const res = await request(app).get('/healthz')
  expect(res.status).toBe(200)
  expect(res.body.ok).toBe(true)
})
