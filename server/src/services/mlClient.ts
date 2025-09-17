import axios from 'axios'

const base = process.env.ML_SERVICE_URL || 'http://localhost:8000'

export async function callMl(path: string, body: any) {
  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const { data } = await axios.post(url, body, { timeout: 30_000 })
  return data
}
