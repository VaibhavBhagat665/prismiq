"use client";
import { useEffect, useRef, useState } from 'react'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { useChats, appendChatMessage } from '../lib/firestore'
import { api } from '../lib/api'

export default function ChatPage() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chats = useChats()

  const messages = chats?.[0]?.messages ?? []

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim()) return
    await appendChatMessage({ role: 'user', text: input })
    setInput("")
    const res = await api.post('/chat', { message: messages.length ? input : input })
    await appendChatMessage({ role: 'assistant', text: res.data.reply })
  }

  return (
    <main className="min-h-screen p-6 space-y-6">
      <Header />
      <div className="glass rounded-xl p-4 max-w-3xl mx-auto">
        <div className="space-y-3 max-h-[60vh] overflow-y-auto">
          {messages.map((m: any, i: number) => (
            <div key={i} className={m.role === 'user' ? 'text-right' : 'text-left'}>
              <span className="inline-block px-3 py-2 rounded-lg bg-white/10">{m.text}</span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="mt-4 flex gap-2">
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" className="flex-1 bg-transparent border border-white/20 rounded-lg px-3 py-2" />
          <button onClick={send} className="px-4 py-2 rounded-lg glass">Send</button>
        </div>
      </div>
      <Footer />
    </main>
  )
}
