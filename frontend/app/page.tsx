import './globals.css'
import Link from 'next/link'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { PrismCanvas } from './components/PrismCanvas'

export default function Home() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center">
      <PrismCanvas />
      <Header />
      <section className="z-10 text-center px-6">
        <h1 className="text-5xl font-semibold tracking-tight">Prismiq — Your Future, Decoded.</h1>
        <p className="mt-4 text-zinc-300 max-w-2xl mx-auto">AI-powered career guidance: recommendations, roadmaps, and chat. No login needed for this demo.</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/dashboard" className="px-5 py-3 rounded-lg glass">Try Demo</Link>
          <Link href="/chat" className="px-5 py-3 rounded-lg border border-white/20">Open Chat</Link>
        </div>
      </section>
      <Footer />
    </main>
  )
}
