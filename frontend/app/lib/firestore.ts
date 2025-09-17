"use client";
import { useEffect, useState } from 'react'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, onSnapshot, query, orderBy, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'

const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  apiKey: "fake-key",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const userDoc = doc(collection(db, 'users'), 'demo-user')

function useCollection(path: string) {
  const [data, setData] = useState<any[]>([])
  useEffect(() => {
    const q = query(collection(userDoc, path), orderBy('createdAt', 'desc'))
    return onSnapshot(q, snap => {
      const arr: any[] = []
      snap.forEach(d => arr.push({ id: d.id, ...d.data() }))
      setData(arr)
    })
  }, [path])
  return data
}
export const useRecommendations = () => useCollection('recommendations')
export const useRoadmaps = () => useCollection('roadmaps')
export const useRecentChats = () => useCollection('chats')
export const useChats = () => useCollection('chats')

export async function appendChatMessage(msg: { role: 'user'|'assistant'; text: string }) {
  const chatsCol = collection(userDoc, 'chats')
  const first = await addDoc(chatsCol, { createdAt: serverTimestamp(), messages: [msg] })
  await updateDoc(first, { messages: [msg] })
}
