import { Sidebar } from '@/components/layout/Sidebar'
import { Navbar } from '@/components/layout/Navbar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black via-violet-950/20 to-black">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        {children}
      </div>
      <Navbar />
    </div>
  )
}
