'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { supabase } from "@/lib/supabaseClient"
import { LIFE_AREAS } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"



export default function ProfilePage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [focusAreas, setFocusAreas] = useState<string[]>([])
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setEmail(user.email ?? '')

            const {data} = await supabase
            .from('user_profiles')
            .select('name, focus_areas')
            .eq('user_id', user.id)
            .single()
            
            if (data?.name) setName(data.name)
            if (data?.focus_areas) setFocusAreas(data.focus_areas)
            setLoading(false)
        }
        fetchProfile()
    }, [])

    async function handleSaveName() {
        if (!newName.trim()) return
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase
                .from('user_profiles')
                .upsert({ user_id: user.id, name: newName.trim() }, { onConflict: 'user_id' })
            setName(newName.trim())
        }
        setSaving(false)
        setEditing(false)
    }

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

          {/* Avatar + nombre + email */}
          <Card>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white">
                {initials}
              </div>
              <div className="flex-1">
                {editing ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="flex-1 rounded-lg bg-white/10 px-3 py-1 text-white outline-none border border-violet-500"
                      placeholder="Your name"
                    />
                    <button
                      onClick={handleSaveName}
                      disabled={saving}
                      className="rounded-lg bg-violet-600 px-3 py-1 text-sm text-white hover:bg-violet-500"
                    >
                      {saving ? '...' : 'Save'}
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="rounded-lg bg-white/10 px-3 py-1 text-sm text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-semibold text-white">{name || 'No name'}</p>
                    <button
                      onClick={() => { setNewName(name); setEditing(true) }}
                      className="text-xs text-white/30 hover:text-violet-400"
                    >
                      ✏️
                    </button>
                  </div>
                )}
                <p className="text-sm text-white/40">{email}</p>
              </div>
            </div>
          </Card>

          {/* Áreas de enfoque del onboarding */}
          {focusAreas.length > 0 && (
            <Card>
              <p className="text-sm text-white/50 mb-3">Focus areas</p>
              <div className="flex flex-wrap gap-2">
                {focusAreas.map((key) => {
                  const area = LIFE_AREAS.find((a) => a.key === key)
                  if (!area) return null
                  return (
                    <span
                      key={key}
                      className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                      style={{ backgroundColor: area.color + '22', color: area.color }}
                    >
                      {area.emoji} {area.label}
                    </span>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Logout */}
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