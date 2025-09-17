"use client";
import Link from 'next/link'

export function Header() {
  return (
    <header className="z-10 fixed top-0 inset-x-0 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-semibold">Prismiq</Link>
      <nav className="flex gap-4 text-sm">
        <Link href="/dashboard">Dashboard</Link>
        <Link href="/chat">Chat</Link>
        <a href="https://github.com/" rel="noreferrer" target="_blank" className="opacity-80">GitHub</a>
      </nav>
    </header>
  )
}
