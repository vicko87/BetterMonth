'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { useHabits } from "@/hooks/useHabits"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { LIFE_AREAS } from "@/lib/constants"
import { Button } from "@/components/ui/Button"



export default function HabitsPage() {
    const router = useRouter()
    const {habits, loading} = useHabits()
    const [localHabits, setLocalHabits] = useState(habits)

    useEffect(() => {
        setLocalHabits(habits)
    }, [habits])

    const [title, setTitle] = useState('')
    const [area, setArea] = useState('health')
    const [saving, setSaving] = useState(false)

    async function handleDelete(id: string) {
        await supabase.from('habits').delete().eq('id', id)
        setLocalHabits((prev) => prev.filter((h) => h.id !== id))
    }

    async function handleAddHabit(e: React.FormEvent) {
        e.preventDefault()
        if (!title.trim()) return
        setSaving(true)

        const { data: {user}} = await supabase.auth.getUser()
        if (!user) {router.push('/login'); return}

        const { data: newHabit } = await supabase.from('habits').insert({
            user_id: user.id,
            title: title.trim(),
            area,
        }).select().single()

        if (newHabit) {
            setLocalHabits((prev) => [newHabit, ...prev])
        }

        setTitle('')
        setSaving(false)
    }

    return (

        <PageWrapper>
             <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">My Habits</h1>
        <p className="text-white/40">Add and manage your habits</p>
      </div>

      <Card className="mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">Add new habit</h2>
        <form onSubmit={handleAddHabit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs text-white/40 mb-1 block">Habit name</label>
            <input
              type="text"
              placeholder="e.g. Meditate 10 minutes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
            />
          </div>
          <div>
            <label className="text-xs text-white/40 mb-1 block">Life area</label>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white outline-none focus:border-violet-500 transition-colors"
            >
              {LIFE_AREAS.map((a) => (
                <option key={a.key} value={a.key} className="bg-[#080810]">
                  {a.emoji} {a.label}
                </option>
              ))}
            </select>
          </div>
          <Button size="lg" disabled={saving}>
            {saving ? 'Saving...' : 'Add habit'}
          </Button>
        </form>
      </Card>

      <h2 className="text-lg font-semibold text-white mb-4">Your habits</h2>
      {loading ? (
        <p className="text-white/40">Loading...</p>
      ) : localHabits.length === 0 ? (
        <Card><p className="text-white/40 text-sm">No habits yet. Add your first one!</p></Card>
      ) : (
        <div className="flex flex-col gap-3">
          {localHabits.map((habit) => {
            const lifeArea = LIFE_AREAS.find((a) => a.key === habit.area)
            return (
              <Card key={habit.id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{lifeArea?.emoji ?? '⭐'}</span>
                    <div>
                      <p className="text-white font-medium">{habit.title}</p>
                      <p className="text-xs text-white/40">{lifeArea?.label ?? habit.area}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className="text-white/20 hover:text-red-400 transition-colors text-lg"
                  >
                    ✕
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}