'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"








export default function ProfilePage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setEmail(user.email ?? '')
            const {data} = await supabase
            .from('user_profiles')
            .select('name')
            .eq('id', user.id)
            .single()
            if (data?.name) setName(data.name)
            setLoading(false)
        }
        fetchProfile()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : '?'

    return (
        <PageWrapper>
            <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Profile</h1>
        <p className="text-white/40">Your account</p>
            </div>

            {loading ? (
                <p className="text-white/40">Loading...</p>
            ) : (
                <div className="flex flex-col gap-4 max-w-md">
                      <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
                {initials}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{name || 'No name'}</p>
                <p className="text-sm text-white/40">{email}</p>
              </div>
            </div>
          </Card>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            <span>🚪</span>
            Log out
          </button>
        </div>
      )} 
                  
        </PageWrapper>
    )
}