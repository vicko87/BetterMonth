'use client'

import Link from "next/link"    
import { Button } from "@/components/ui/Button"


export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#080810] via-violet-950/30 to-[#080810] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Create account</h1>
          <p className="text-white/50">Start your 30-day challenge</p>
        </div>

        <form className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <Button size="lg" className="w-full mt-2">Create account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Already have an account?{' '}
          <Link href="/login" className="text-violet-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}