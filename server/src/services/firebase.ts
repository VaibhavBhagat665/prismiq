/** Firebase Admin SDK initialization */
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK
let app;
if (getApps().length === 0) {
  // Check if all required environment variables are present
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!projectId || !clientEmail || !privateKey) {
    console.error('Missing Firebase credentials. Required env vars: FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY');
    throw new Error('Firebase credentials not configured');
  }

  // Use service account credentials from environment variables
  const serviceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  app = initializeApp({
    credential: cert(serviceAccount),
    projectId,
  });
} else {
  app = getApps()[0];
}

// Export Firestore instance
export const db = getFirestore(app);
