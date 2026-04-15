'use client'

import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { LIFE_AREAS } from "@/lib/constants"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"



const WEEKLY_DATA = [
    { day: 'Mon', completed: 3 },
    { day: 'Tue', completed: 2 },
    { day: 'Wed', completed: 4 },
    { day: 'Thu', completed: 3 },
    { day: 'Fri', completed: 5 },
    { day: 'Sat', completed: 2 },
    { day: 'Sun', completed: 4 },
]

const HABIT_PROGRESS = [
     { name: 'English', area: 'work',   completed: 18, total: 30 },
  { name: 'Gym',     area: 'health', completed: 12, total: 30 },
  { name: 'Reading', area: 'growth', completed: 22, total: 30 },
]



export default function ProgressPage() {
  return (
     <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Progress</h1>
        <p className="text-white/40">Your stats this week</p>
      </div>

      <Card className="mb-4">
        <p className="text-sm text-white/40 mb-4">Tasks completed per day</p>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={WEEKLY_DATA} barSize={10}>
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

      <h2 className="text-lg font-semibold text-white mb-3">Habits</h2>
      <div className="flex flex-col gap-3">
        {HABIT_PROGRESS.map((habit) => {
          const area = LIFE_AREAS.find((a) => a.key === habit.area)
          return (
            <Card key={habit.name}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-white">{habit.name}</p>
                <p className="text-xs text-white/40">{habit.completed}/{habit.total} days</p>
              </div>
              <ProgressBar value={habit.completed} max={habit.total} color={area?.color} />
            </Card>
          )
        })}
      </div>
    </PageWrapper>
  )
}