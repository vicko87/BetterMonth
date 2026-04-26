'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"



const NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/tasks', label: 'Today\'s tasks', icon: '✅' },
  { href: '/habits', label: 'My Habits', icon: '⭐' },
  { href: '/progress', label: 'Progress', icon: '📊' },
  { href: '/life-wheel', label: 'Life Wheel', icon: '🎯' }, 
]


export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    async function handleLogout() {
       await supabase.auth.signOut()
       router.push('/login')
    }

    return (
         <aside className="hidden md:flex flex-col w-60 min-h-screen border-r border-white/10 bg-black/40 px-4 py-8 backdrop-blur-md">
      <div className="mb-10 px-2">
        <h1 className="text-xl font-bold text-white">BetterMonth</h1>
        <p className="text-xs text-white/40">30 days challenge</p>
      </div>
      <nav className="flex flex-col gap-1">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              pathname === link.href
                ? 'bg-violet-600/20 text-violet-400'
                : 'text-white/50 hover:bg-white/5 hover:text-white'
            )}
          >
            <span className="text-lg">{link.icon}</span>
            {link.label}
          </Link>
        ))}
      </nav>
        <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-colors hover:bg-white/5 hover:text-white"
        >
          <span className="text-lg">🚪</span>
          Log out
        </button>
      </div>
    </aside>
  )
}