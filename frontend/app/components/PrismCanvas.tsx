"use client";
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Scene = dynamic(() => import('./PrismScene'), { ssr: false, loading: () => <></> })

export function PrismCanvas() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Suspense fallback={<div className='w-full h-full' />}> <Scene /> </Suspense>
    </div>
  )
}
