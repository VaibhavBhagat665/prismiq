import axios from 'axios'

export const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api' })

export type RecommendResponse = { recommendations: { career: string; confidence: number; tags: string[] }[] }
export type RoadmapResponse = { roadmap: { phase: string; skills: string[]; courses: string[]; projects: string[] }[] }
export type ChatResponse = { reply: string; sources?: any[] }
