'use client'

import { useTasks } from '@/hooks/useTasks'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { LIFE_AREAS } from '@/lib/constants'
import { useEffect, useRef, useState } from 'react'
import confetti from 'canvas-confetti'

const TIME_SLOTS = [
  { key: 'morning', label: 'Morning', emoji: '🌅' },
  { key: 'afternoon', label: 'Afternoon', emoji: '☀️' },
  { key: 'evening', label: 'Evening', emoji: '🌙' },
] as const

type TimeSlot = typeof TIME_SLOTS[number]['key']

function getWeekDays() {
  const days = []
  const today = new Date()
  const dow = today.getDay()
  // show Mon-Sun week containing today
  const monday = new Date(today)
  monday.setDate(today.getDate() - ((dow + 6) % 7))
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    days.push(d)
  }
  return days
}

const DAY_LABELS = ['D', 'L', 'M', 'X', 'J', 'V', 'S']

export default function TasksPage() {
  const { tasks, loading, toggleTask } = useTasks()
  const [activeSlot, setActiveSlot] = useState<TimeSlot>(() => {
    const h = new Date().getHours()
    if (h < 12) return 'morning'
    if (h < 19) return 'afternoon'
    return 'evening'
  })

  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length
  const confettiFired = useRef(false)

  useEffect(() => {
    if (total > 0 && completed === total) {
      if (!confettiFired.current) {
        confettiFired.current = true
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#7c3aed', '#a78bfa', '#ffffff', '#fbbf24'],
        })
      }
    } else {
      confettiFired.current = false
    }
  }, [completed, total])

  const today = new Date()
  const weekDays = getWeekDays()
  const todayIso = today.toISOString().split('T')[0]

  const slotTasks = tasks.filter(
    (t) => (t.habits?.time_of_day ?? 'morning') === activeSlot
  )
  const slotDone = slotTasks.filter((t) => t.completed).length

  const monthLabel = today.toLocaleDateString('en-US', { month: 'long' })
  const dayLabel = today.toLocaleDateString('en-US', { weekday: 'long' })

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-4">
        <p className="text-white/40 text-sm capitalize">{monthLabel}</p>
        <h1 className="text-3xl font-bold text-white capitalize">{dayLabel}</h1>
        <p className="text-white/40 text-sm mt-1">
          {loading ? 'Loading...' : `${completed} of ${total} completed`}
        </p>
      </div>

      {/* Week strip */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {weekDays.map((d) => {
          const iso = d.toISOString().split('T')[0]
          const isToday = iso === todayIso
          return (
            <div
              key={iso}
              className={`flex flex-col items-center flex-1 py-2 rounded-xl min-w-[36px] ${
                isToday ? 'bg-violet-600' : 'bg-white/5'
              }`}
            >
              <span className={`text-[10px] font-medium ${isToday ? 'text-white/70' : 'text-white/30'}`}>
                {DAY_LABELS[d.getDay()]}
              </span>
              <span className={`text-sm font-bold ${isToday ? 'text-white' : 'text-white/50'}`}>
                {d.getDate()}
              </span>
            </div>
          )
        })}
      </div>

      {/* Time slot tabs */}
      <div className="flex gap-2 mb-6">
        {TIME_SLOTS.map((slot) => {
          const count = tasks.filter((t) => (t.habits?.time_of_day ?? 'morning') === slot.key).length
          return (
            <button
              key={slot.key}
              onClick={() => setActiveSlot(slot.key)}
              className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeSlot === slot.key
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}
            >
              {slot.emoji} {slot.label}
              {count > 0 && (
                <span className={`ml-1 text-xs ${activeSlot === slot.key ? 'text-white/70' : 'text-white/30'}`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Tasks */}
      {!loading && slotTasks.length === 0 && (
        <Card>
          <p className="text-white/40 text-sm text-center py-2">
            No tasks for this slot. Add habits first!
          </p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {slotTasks.map((task) => {
          const lifeArea = LIFE_AREAS.find((a) => a.key === task.habits?.area)
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id, task.completed)}
              className="w-full text-left"
            >
              <Card className={task.completed ? 'opacity-50' : ''}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-xl flex-shrink-0"
                      style={{ backgroundColor: `${lifeArea?.color}20`, border: `1px solid ${lifeArea?.color}40` }}
                    >
                      {lifeArea?.emoji ?? '⭐'}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-medium truncate ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                        {task.habits?.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: lifeArea?.color ?? '#ffffff60' }}>
                        {lifeArea?.label ?? task.habits?.area}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-white/30'
                    }`}
                  >
                    {task.completed && <span className="text-white text-xs font-bold">✓</span>}
                  </div>
                </div>
              </Card>
            </button>
          )
        })}
      </div>

      {/* Slot progress */}
      {slotTasks.length > 0 && (
        <p className="text-center text-white/30 text-xs mt-4">
          {slotDone}/{slotTasks.length} in this slot
        </p>
      )}
    </PageWrapper>
  )
}