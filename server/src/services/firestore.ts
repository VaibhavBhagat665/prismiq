import admin from 'firebase-admin'
import pino from 'pino'

const logger = pino({ level: 'info' })

export function initFirestore() {
  if (admin.apps.length) return
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
  if (!projectId || !clientEmail || !privateKey) {
    logger.warn({ msg: 'firebase_missing_env' })
    return
  }
  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey } as any)
  })
}

function userDoc() {
  const db = admin.firestore()
  return db.collection('users').doc('demo-user')
}

export async function writeRecommendations(data: any) {
  try {
    if (!admin.apps.length) return
    await userDoc().collection('recommendations').add({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() })
  } catch (e) { logger.error(e) }
}
export async function writeRoadmap(data: any) {
  try {
    if (!admin.apps.length) return
    await userDoc().collection('roadmaps').add({ ...data, createdAt: admin.firestore.FieldValue.serverTimestamp() })
  } catch (e) { logger.error(e) }
}
export async function writeChatMessage(msg: { role: 'user'|'assistant'; text: string }) {
  try {
    if (!admin.apps.length) return
    await userDoc().collection('chats').add({ createdAt: admin.firestore.FieldValue.serverTimestamp(), messages: [msg] })
  } catch (e) { logger.error(e) }
}
