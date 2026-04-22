'use client'

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"



export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
        if (signInError) {
            setError(signInError.message)
            setLoading(false)
            return
        }
        router.push('/dashboard')
    }
  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-linear-to-br from-[#080810] via-violet-950/30 to-[#080810] p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-1">Welcome back</h1>
          <p className="text-white/50">Sign in to BetterMonth</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Email</label>
            <input
              type="email"
              placeholder="you@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <Button size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-white/40">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-violet-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}