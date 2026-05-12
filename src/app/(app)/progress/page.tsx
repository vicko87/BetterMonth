'use client'

import { useEffect, useMemo, useState } from "react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { LIFE_AREAS } from "@/lib/constants"
import { supabase } from "@/lib/supabaseClient"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"

type HabitRow = {
  id: string
  title: string
  area: string
}

type DailyTaskRow = {
  habit_id: string
  date: string
  completed: boolean
}

type WeeklyPoint = {
  day: string
  completed: number
}

type HabitProgress = {
  id: string
  name: string
  area: string
  completed: number
  total: number
}

function getLast7Days() {
  const days: { iso: string; label: string }[] = []
  const formatter = new Intl.DateTimeFormat('en-US', { weekday: 'short' })

  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setHours(12, 0, 0, 0)
    d.setDate(d.getDate() - i)
    const iso = d.toISOString().split('T')[0]
    days.push({ iso, label: formatter.format(d) })
  }

  return days
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true)
  const [weeklyData, setWeeklyData] = useState<WeeklyPoint[]>([])
  const [habitProgress, setHabitProgress] = useState<HabitProgress[]>([])
  const[calendarData, setCalendarData] = useState<{ date: string; pct: number }[]>([])

  const last7 = useMemo(() => getLast7Days(), [])

  useEffect(() => {
    async function loadProgress() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }

      const { data: habitsData } = await supabase
        .from('habits')
        .select('id, title, area')
        .eq('user_id', user.id)

      const habits = (habitsData ?? []) as HabitRow[]

      const weekStart = last7[0]?.iso
      const { data: weekTasksData } = await supabase
        .from('daily_tasks')
        .select('habit_id, date, completed')
        .eq('user_id', user.id)
        .gte('date', weekStart)

      const weekTasks = (weekTasksData ?? []) as DailyTaskRow[]

      const weekly = last7.map((d) => ({
        day: d.label,
        completed: weekTasks.filter((t) => t.date === d.iso && t.completed).length,
      }))
      setWeeklyData(weekly)

      const { data: completedTasksData } = await supabase
        .from('daily_tasks')
        .select('habit_id')
        .eq('user_id', user.id)
        .eq('completed', true)

      const completedTasks = (completedTasksData ?? []) as Pick<DailyTaskRow, 'habit_id'>[]

      const completedByHabit = completedTasks.reduce<Record<string, number>>((acc, t) => {
        acc[t.habit_id] = (acc[t.habit_id] ?? 0) + 1
        return acc
      }, {})

      const habitsProgress = habits.map((h) => ({
        id: h.id,
        name: h.title,
        area: h.area,
        completed: Math.min(completedByHabit[h.id] ?? 0, 30),
        total: 30,
      }))

      setHabitProgress(habitsProgress)

      // Calendario últimos 84 días (12 semanas)
      const calStart = new Date()
      calStart.setDate(calStart.getDate() - 83)
      const calStartStr = calStart.toISOString().split('T')[0]

      const { data: calTasksData } = await supabase
        .from('daily_tasks')
        .select('date, completed')
        .eq('user_id', user.id)
        .gte('date', calStartStr)

      const calTasks = calTasksData ?? []

      const calByDate: Record<string, { total: number; done: number }> = {}
      for (const t of calTasks) {
        if (!calByDate[t.date]) calByDate[t.date] = { total: 0, done: 0 }
        calByDate[t.date].total++
        if (t.completed) calByDate[t.date].done++
      }

      const cal: { date: string; pct: number }[] = []
      for (let i = 83; i >= 0; i--) {
        const d = new Date()
        d.setDate(d.getDate() - i)
        const iso = d.toISOString().split('T')[0]
        const day = calByDate[iso]
        const pct = day && day.total > 0 ? Math.round((day.done / day.total) * 100) : 0
        cal.push({ date: iso, pct })
      }

      setCalendarData(cal)
      setLoading(false)
    }

    loadProgress()
  }, [last7])

  return (
     <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-white/40">Your stats this week</p>
      </div>

      {loading && <p className="text-white/40 text-sm mb-4">Loading...</p>}

      <Card className="mb-4">
        <p className="text-sm text-white/40 mb-4">Tasks completed per day</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={weeklyData} barSize={10}>
            <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: '#1a1a2e', border: 'none', borderRadius: 8, color: 'white' }}
              cursor={{ fill: 'rgba(167,139,250,0.1)' }}
            />
            <Bar dataKey="completed" fill="#a78bfa" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card className="mb-4">
        <p className="text-sm text-white/40 mb-3">Activity — last 12 weeks</p>

        {/* Month labels */}
        <div className="flex mb-1 pl-5">
          {Array.from({ length: 12 }).map((_, weekIdx) => {
            const day = calendarData[weekIdx * 7]
            if (!day) return <div key={weekIdx} className="flex-1" />
            const d = new Date(day.date)
            const showMonth = d.getDate() <= 7
            return (
              <div key={weekIdx} className="flex-1 text-[9px] text-white/40">
                {showMonth ? d.toLocaleString('en-US', { month: 'short' }) : ''}
              </div>
            )
          })}
        </div>

        {/* Day labels + grid */}
        <div className="flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 mr-1">
            {['M', '', 'W', '', 'F', '', 'S'].map((label, i) => (
              <div key={i} className="aspect-square w-4 text-[9px] text-white/30 flex items-center justify-center">
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div className="flex gap-1 flex-1">
            {Array.from({ length: 12 }).map((_, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1 flex-1">
                {calendarData.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => (
                  <div
                    key={day.date}
                    title={`${day.date}: ${day.pct}%`}
                    className={`aspect-square w-full rounded-sm ${
                      day.pct === 100
                        ? 'bg-green-400'
                        : day.pct >= 50
                        ? 'bg-green-700'
                        : day.pct > 0
                        ? 'bg-green-900'
                        : 'bg-white/5'
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-3 justify-end">
          <span className="text-[10px] text-white/30">Less</span>
          <div className="w-3 h-3 rounded-sm bg-white/5" />
          <div className="w-3 h-3 rounded-sm bg-green-900" />
          <div className="w-3 h-3 rounded-sm bg-green-700" />
          <div className="w-3 h-3 rounded-sm bg-green-400" />
          <span className="text-[10px] text-white/30">More</span>
        </div>
      </Card>

      <h2 className="text-lg font-semibold text-white mb-3">Habits</h2>
      <div className="flex flex-col gap-3">
        {habitProgress.map((habit) => {
          const area = LIFE_AREAS.find((a) => a.key === habit.area)
          return (
            <Card key={habit.id}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">{habit.name}</p>
                <p className="text-xs text-white/40">{habit.completed}/{habit.total} days</p>
              </div>
              <ProgressBar value={habit.completed} max={habit.total} color={area?.color} />
            </Card>
          )
        })}

        {!loading && habitProgress.length === 0 && (
          <Card>
            <p className="text-sm text-white/40">No habits yet. Add your first habit to see real progress.</p>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}