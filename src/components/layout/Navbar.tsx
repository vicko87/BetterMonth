'use client'

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { supabase } from "@/lib/supabaseClient"



const NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { href: '/tasks', label: 'Tasks', icon: '✅' },
  { href: '/habits', label: 'My Habits', icon: '⭐' },
  { href: '/progress', label: 'Progress', icon: '📊' },
  { href: '/life-wheel', label: 'Life Wheel', icon: '⚖️' },
]

export function Navbar() {
    const pathname = usePathname()
    const router = useRouter()

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

     return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md md:hidden">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            'flex flex-col items-center gap-1 text-xs transition-colors',
            pathname === link.href ? 'text-violet-400' : 'text-white/40 hover:text-white/70'
          )}
        >
          <span className="text-xl">{link.icon}</span>
          {link.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="flex flex-col items-center gap-1 text-xs text-white/40 transition-colors hover:text-white/70"
      >
        <span className="text-xl">🚪</span>
        Log out
      </button>
    </nav>
  )
}