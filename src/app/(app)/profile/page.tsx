'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { supabase } from "@/lib/supabaseClient"
import { LIFE_AREAS } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useHabits } from "@/hooks/useHabits"
import { useStreak } from "@/hooks/useStreak"
import { useXP } from "@/hooks/useXP"
import { Camera } from "lucide-react"



export default function ProfilePage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [focusAreas, setFocusAreas] = useState<string[]>([])
    const [editing, setEditing] = useState(false)
    const [newName, setNewName] = useState('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { habits } = useHabits()
    const { streak } = useStreak()
    const { xp, level, levelLabel} = useXP()

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setEmail(user.email ?? '')

            const {data} = await supabase
            .from('user_profiles')
            .select('name, focus_areas, avatar_url')
            .eq('id', user.id)
            .single()

            const profileName = data?.name
                || user.user_metadata?.full_name
                || user.user_metadata?.name
                || user.email?.split('@')[0]
                || ''
            setName(profileName)
            if (data?.focus_areas) setFocusAreas(data.focus_areas)
            if (data?.avatar_url) setAvatarUrl(data.avatar_url)  
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
                .upsert({ id: user.id, name: newName.trim() }, { onConflict: 'id' })
            setName(newName.trim())
        }
        setSaving(false)
        setEditing(false)
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setUploading(false); return }
      
        const ext = file.name.split('.').pop()
         const path = `${user.id}/avatar.${ext}`

         const { error} = await supabase.storage
          .from('avatars')
          .upload(path, file, { upsert: true })

          if(!error) {
            const {data : urlData} = supabase.storage.from('avatars').getPublicUrl(path)
            const newUrl = urlData.publicUrl + `?t=${Date.now()}`
            await supabase
            .from('user_profiles')
            .upsert({ id: user.id, avatar_url: newUrl }, { onConflict: 'id' })
              setAvatarUrl(newUrl)
          }
          setUploading(false)
    }
    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase()
    : email[0]?.toUpperCase() ?? '?'

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
                            <div className="relative shrink-0">
                                <div
                                    className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-600 text-2xl font-bold text-white overflow-hidden cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {avatarUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={avatarUrl} alt="avatar" className="h-full w-full object-cover" />
                                    ) : (
                                        initials
                                    )}
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={uploading}
                                    className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-white hover:bg-violet-400 transition-colors"
                                >
                                    {uploading ? <span className="text-[10px]">...</span> : <Camera size={12} />}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleAvatarUpload}
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                {editing ? (
                                    <div className="flex flex-col gap-2">
                                        <input
                                            autoFocus
                                            value={newName}
                                            onChange={(e) => setNewName(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                                            className="w-full rounded-lg bg-white/10 px-3 py-2 text-white outline-none border border-violet-500"
                                            placeholder="Your name"
                                        />
                                        <div className="flex gap-2">
                                            <button onClick={handleSaveName} disabled={saving}
                                                className="flex-1 rounded-lg bg-violet-600 px-3 py-2 text-sm text-white hover:bg-violet-500">
                                                {saving ? '...' : 'Save'}
                                            </button>
                                            <button onClick={() => setEditing(false)}
                                                className="flex-1 rounded-lg bg-white/10 px-3 py-2 text-sm text-white/60 hover:text-white">
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <p className="text-lg font-semibold text-white truncate">{name || 'No name'}</p>
                                        <button onClick={() => { setNewName(name); setEditing(true) }}
                                            className="text-xs text-white/30 hover:text-violet-400 shrink-0">✏️</button>
                                    </div>
                                )}
                                <p className="text-sm text-white/40 truncate">{email}</p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-3 gap-3">
                        <Card className="text-center py-3">
                            <p className="text-2xl font-bold text-violet-400">{streak}</p>
                            <p className="text-xs text-white/40 mt-1">Day streak</p>
                        </Card>
                        <Card className="text-center py-3">
                            <p className="text-2xl font-bold text-violet-400">{habits.length}</p>
                            <p className="text-xs text-white/40 mt-1">Habits</p>
                        </Card>
                        <Card className="text-center py-3">
                            <p className="text-lg font-bold text-violet-400">Lv.{level}</p>
                            <p className="text-xs text-white/40 mt-1">{levelLabel}</p>
                        </Card>
                    </div>

                    <Card>
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-sm text-white/50">Total XP</p>
                            <p className="text-sm font-bold text-violet-400">{xp} XP</p>
                        </div>
                        <div className="h-2 rounded-full bg-white/10">
                            <div className="h-2 rounded-full bg-linear-to-r from-violet-600 to-violet-400 transition-all duration-700"
                                style={{ width: `${Math.min((xp % 100) / 100 * 100, 100)}%` }} />
                        </div>
                    </Card>

                    {focusAreas.length > 0 && (
                        <Card>
                            <p className="text-sm text-white/50 mb-3">Focus areas</p>
                            <div className="flex flex-wrap gap-2">
                                {focusAreas.map((key) => {
                                    const area = LIFE_AREAS.find((a) => a.key === key)
                                    if (!area) return null
                                    return (
                                        <span key={key} className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium"
                                            style={{ backgroundColor: area.color + '22', color: area.color }}>
                                            {area.emoji} {area.label}
                                        </span>
                                    )
                                })}
                            </div>
                        </Card>
                    )}

                    <button onClick={handleLogout}
                        className="flex items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/20">
                        <span>🚪</span> Log out
                    </button>
                </div>
            )}
        </PageWrapper> 
  )
}