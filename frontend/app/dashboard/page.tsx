"use client";
import Link from 'next/link'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useRecommendations, useRoadmaps, useRecentChats } from '../lib/firestore'
import { api } from '../lib/api'
import { useState } from 'react'

export default function DashboardPage() {
  const recs = useRecommendations()
  const roads = useRoadmaps()
  const chats = useRecentChats()
  const [loading, setLoading] = useState(false)
  const [localRecs, setLocalRecs] = useState<any[] | null>(null)

  const generate = async () => {
    setLoading(true)
    try {
      const profile = { summary: 'Demo user with Python and ML experience', skills: ['python','ml','sql'] }
      const res = await api.post('/recommend', { profile })
      setLocalRecs(res.data.recommendations || res.data.recommendations)
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  return (
    <main className="min-h-screen p-6 space-y-8">
      <Header />
      <div className="flex items-center gap-6">
        <h2 className="text-3xl font-semibold">Dashboard</h2>
        <button onClick={generate} className="px-4 py-2 rounded-lg glass">{loading ? 'Generating...' : 'Generate Recommendations'}</button>
      </div>

      <img src="/dashboard-illustration.svg" alt="Dashboard illustration" className="rounded-lg w-full max-w-4xl shadow-lg" />

      <section className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-4">
          <h3 className="text-xl mb-2">Career Recommendations</h3>
          <ul className="space-y-2">
            {(localRecs || recs?.[0]?.recommendations)?.map((r: any, i: number) => (
              <li key={i} className="flex items-center justify-between">
                <span>{r.career}</span>
                <span className="text-zinc-300">{Math.round(r.confidence * 100)}%</span>
              </li>
            )) || <li>No data yet</li>}
          </ul>
          <Link href="/chat" className="inline-block mt-4 text-sm underline">Ask for more</Link>
        </div>
        <div className="glass rounded-xl p-4 md:col-span-2">
          <h3 className="text-xl mb-2">Roadmap</h3>
          <div className="space-y-3">
            {roads?.[0]?.roadmap?.map((p: any, i: number) => (
              <details key={i} className="rounded-lg border border-white/10 p-3">
                <summary className="cursor-pointer font-medium">{p.phase}</summary>
                <div className="mt-2 text-sm text-zinc-300">
                  <p><b>Skills:</b> {p.skills?.join(', ')}</p>
                  <p><b>Courses:</b> {p.courses?.join(', ')}</p>
                  <p><b>Projects:</b> {p.projects?.join(', ')}</p>
                </div>
              </details>
            )) || <p>No data yet</p>}
          </div>
        </div>
      </section>
      <section className="glass rounded-xl p-4">
        <h3 className="text-xl mb-2">Recent Chats</h3>
        <ul className="space-y-2">
          {chats?.slice(0, 5).map((c: any) => (
            <li key={c.id} className="text-sm text-zinc-300 truncate">{c.messages?.[c.messages.length-1]?.text}</li>
          )) || <li>No chats yet</li>}
        </ul>
      </section>
      <Footer />
    </main>
  )
}
