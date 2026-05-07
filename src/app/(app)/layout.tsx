'use client'

import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'
import { useNotification } from '@/hooks/useNotification'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  useNotification()

  return (
    <div className="flex min-h-screen bg-linear-to-br from-black via-violet-950/20 to-black">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {children}
      </div>
      <Navbar />
    </div>
  )
}
