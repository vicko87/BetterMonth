'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { useHabits } from "@/hooks/useHabits"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/Card"
import { LIFE_AREAS } from "@/lib/constants"
import { Button } from "@/components/ui/Button"


const HABIT_SUGGESTIONS = [
  { emoji: '🧘', title: 'Meditate 10 min' },
  { emoji: '📚', title: 'Read 20 pages' },
  { emoji: '🏋️', title: 'Go to the gym' },
  { emoji: '🚶', title: 'Walk 30 min' },
  { emoji: '💧', title: 'Drink 2L water' },
  { emoji: '📝', title: "Don't drink alcohol" },
  { emoji: '🗣️', title: 'Practice a language' },
  { emoji: '🥗', title: 'Balanced diet' },
  { emoji: '💻', title: 'Study 1 hour' },
  { emoji: '🌅', title: 'Morning stretch' },
  { emoji: '🚫', title: 'No social media' },
  { emoji: '👥', title: 'Meet new people' },
  { emoji: '🌙', title: 'Sleep by 11pm' },
]

    const DAYS = [
  { label: 'L', value: 1 },
  { label: 'M', value: 2 },
  { label: 'X', value: 3 },
  { label: 'J', value: 4 },
  { label: 'V', value: 5 },
  { label: 'S', value: 6 },
  { label: 'D', value: 0 },
]

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
    const [days, setDays] = useState<number[]>([])
    const [timeOfDay, setTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editArea, setEditArea] = useState('health')
    const [editDays, setEditDays] = useState<number[]>([])
    const [editTimeOfDay, setEditTimeOfDay] = useState<'morning' | 'afternoon' | 'evening'>('morning')
    const [editSaving, setEditSaving] = useState(false)

    function toggleEditDay(d: number) {
        setEditDays(prev => prev.includes(d) ? prev.filter((x: number) => x !== d) : [...prev, d])
    }

    function startEdit(habit: typeof localHabits[0]) {
        setEditingId(habit.id)
        setEditTitle(habit.title)
        setEditArea(habit.area)
        setEditTimeOfDay(habit.time_of_day as 'morning' | 'afternoon' | 'evening')
        setEditDays(habit.days ?? [])
    }

    async function handleSaveEdit(id: string) {
        setEditSaving(true)
        await supabase.from('habits').update({
            title: editTitle.trim(),
            area: editArea,
            days: editDays,
            time_of_day: editTimeOfDay,
        }).eq('id', id)
        setLocalHabits(prev => prev.map(h => h.id === id ? { ...h, title: editTitle.trim(), area: editArea, days: editDays, time_of_day: editTimeOfDay } : h))
        setEditingId(null)
        setEditSaving(false)
    }

function toggleDay(d: number) {
  setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
}

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
            days,
            time_of_day: timeOfDay,
        }).select().single()

        if (newHabit) {
            setLocalHabits((prev) => [newHabit, ...prev])
        }

        setTitle('')
        setDays([])
        setTimeOfDay('morning')
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
            <div className="flex flex-wrap gap-2 mt-2">
              {HABIT_SUGGESTIONS.filter(s =>
                !title || s.title.toLowerCase().includes(title.toLowerCase())
              ).map((s) => (
                <button
                  key={s.title}
                  type="button"
                  onClick={() => setTitle(s.title)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    title === s.title
                      ? 'bg-violet-600 border-violet-500 text-white'
                      : 'bg-white/5 border-white/10 text-white/50 hover:text-white hover:border-white/30'
                  }`}
                >
                  {s.emoji} {s.title}
                </button>
              ))}
                </div>
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
          <div>
            <label className="text-xs text-white/40 mb-2 block">Days</label>
            <div className="flex gap-2">
              {DAYS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => toggleDay(d.value)}
                  className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                    days.includes(d.value)
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-white/40 mb-2 block">Time of day</label>
            <div className="flex gap-2">
              {([['morning', '🌅 Morning'], ['afternoon', '☀️ Afternoon'], ['evening', '🌙 Evening']] as const).map(([val, label]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setTimeOfDay(val)}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                    timeOfDay === val
                      ? 'bg-violet-600 text-white'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
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
             <Card key={habit.id} className="overflow-hidden">
  {editingId === habit.id ? (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        value={editTitle}
        onChange={e => setEditTitle(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none focus:border-violet-500"
      />
      <select
        value={editArea}
        onChange={e => setEditArea(e.target.value)}
        className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-white text-sm outline-none"
      >
        {LIFE_AREAS.map(a => (
          <option key={a.key} value={a.key} className="bg-[#080810]">{a.emoji} {a.label}</option>
        ))}
      </select>
      <div className="flex gap-1.5">
        {DAYS.map(d => (
          <button key={d.value} type="button" onClick={() => toggleEditDay(d.value)}
            className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
              editDays.includes(d.value) ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/40 border border-white/10'
            }`}>{d.label}</button>
        ))}
      </div>
      <div className="flex gap-2">
        {(['morning', 'afternoon', 'evening'] as const).map(val => (
          <button key={val} type="button" onClick={() => setEditTimeOfDay(val)}
            className={`flex-1 py-1.5 rounded-xl text-xs font-medium transition-colors ${
              editTimeOfDay === val ? 'bg-violet-600 text-white' : 'bg-white/5 text-white/40 border border-white/10'
            }`}>
            {val === 'morning' ? '🌅' : val === 'afternoon' ? '☀️' : '🌙'} {val.charAt(0).toUpperCase() + val.slice(1)}
          </button>
        ))}
      </div>
      <div className="flex gap-2">
        <button onClick={() => setEditingId(null)} className="flex-1 py-2 rounded-xl text-sm text-white/40 bg-white/5 border border-white/10">Cancel</button>
        <button onClick={() => handleSaveEdit(habit.id)} disabled={editSaving} className="flex-1 py-2 rounded-xl text-sm text-white bg-violet-600 font-medium">
          {editSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl shrink-0"
          style={{ backgroundColor: `${lifeArea?.color}20`, border: `1px solid ${lifeArea?.color}40` }}
        >
          {lifeArea?.emoji ?? '⭐'}
        </div>
        <div>
          <p className="text-white font-medium">{habit.title}</p>
          <div className="flex items-center gap-2 mt-0.5">
            <p className="text-xs font-medium" style={{ color: lifeArea?.color ?? '#ffffff80' }}>
              {lifeArea?.label ?? habit.area}
            </p>
            {habit.time_of_day && (
              <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded-full">
                {habit.time_of_day === 'morning' ? '🌅' : habit.time_of_day === 'afternoon' ? '☀️' : '🌙'}
                {' '}{habit.time_of_day === 'morning' ? 'Morning' : habit.time_of_day === 'afternoon' ? 'Afternoon' : 'Evening'}
              </span>
            )}
          </div>
          <div className="flex gap-1 mt-1.5">
            {DAYS.map(d => (
              <span key={d.value}
                className={`text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-medium ${
                  !Array.isArray(habit.days) || habit.days.length === 0 || habit.days.includes(d.value)
                    ? 'bg-violet-600/60 text-white' : 'text-white/20'
                }`}>{d.label}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => startEdit(habit)} className="text-white/20 hover:text-violet-400 transition-colors">✏️</button>
        <button onClick={() => handleDelete(habit.id)} className="text-white/20 hover:text-red-400 transition-colors text-lg">✕</button>
      </div>
    </div>
  )}
</Card>
            )
          })}
        </div>
      )}
    </PageWrapper>
  )
}