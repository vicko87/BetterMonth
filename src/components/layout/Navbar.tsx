'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Home, CheckSquare, Star, Bot, MoreHorizontal, BarChart2, Target, User } from "lucide-react"

const MAIN_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/habits', label: 'Habits', icon: Star },
  { href: '/coach', label: 'Coach', icon: Bot },
]

const MORE_LINKS = [
  { href: '/progress', label: 'Progress', icon: BarChart2 },
  { href: '/life-wheel', label: 'Life Wheel', icon: Target },
  { href: '/profile', label: 'Profile', icon: User },
]

export function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {menuOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {menuOpen && (
        <div className="fixed bottom-20 right-4 z-50 rounded-2xl border border-white/10 bg-black/90 backdrop-blur-md py-2 min-w-[160px]">
          {MORE_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                pathname === link.href ? 'text-violet-400' : 'text-white/60 hover:text-white'
              )}
            >
              <link.icon size={16} />
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t border-white/10 bg-black/80 px-4 py-3 backdrop-blur-md md:hidden">
        {MAIN_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              'flex flex-col items-center gap-1 text-xs transition-colors',
              pathname === link.href ? 'text-violet-400' : 'text-white/40 hover:text-white/70'
            )}
          >
            <link.icon size={22} />
            {link.label}
          </Link>
        ))}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={cn(
            'flex flex-col items-center gap-1 text-xs transition-colors',
            menuOpen ? 'text-violet-400' : 'text-white/40 hover:text-white/70'
          )}
        >
          <MoreHorizontal size={22} />
          More
        </button>
      </nav>
    </>
  )
}