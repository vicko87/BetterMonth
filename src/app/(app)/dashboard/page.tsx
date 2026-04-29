'use client'
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { useHabits } from "@/hooks/useHabits"
import { useStreak } from "@/hooks/useStreak"
import { useTasks } from "@/hooks/useTasks"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import Link from "next/link"
import { LIFE_AREAS } from "@/lib/constants"

export default function DashboardPage() {
    const { habits, loading: habitsLoading } = useHabits()
    const { streak, todayProgress } = useStreak()
    const { tasks } = useTasks()
    const [userName, setUserName] = useState('')

    useEffect(() => {
        async function fetchProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            const { data: profileData } = await supabase
                .from('user_profiles')
                .select('name')
                .eq('id', user.id)
                .single()
            if (profileData?.name) setUserName(profileData.name)
        }
        fetchProfile()
    }, [])

    const activeHabits = habits.length

    // Porcentaje de tareas completadas hoy
    const todayPct = todayProgress.total > 0
        ? Math.round((todayProgress.completed / todayProgress.total) * 100)
        : 0

    return (
        <PageWrapper>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-white">
                    {userName ? `Hello, ${userName} 👋` : 'Dashboard'}
                </h1>
                <p className="text-white/40">Your progress today</p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <div className="flex items-center gap-2">
                        <span className="text-2xl">🔥</span>
                        <div>
                            <p className="text-2xl font-bold text-white">{streak}</p>
                            <p className="text-xs text-white/40">day streak</p>
                        </div>
                    </div>
                </Card>

                <Card>
                    <p className="text-sm text-white/40 mb-1">Today&apos;s progress</p>
                    <p className="text-2xl font-bold text-white mb-3">{todayPct}%</p>
                    <ProgressBar value={todayPct} />
                    <p className="text-xs text-white/40 mt-2">
                        {todayProgress.completed} of {todayProgress.total} habits done
                    </p>
                </Card>

                <Card>
                    <p className="text-sm text-white/40 mb-1">Active habits</p>
                    <p className="text-2xl font-bold text-white">
                        {habitsLoading ? '...' : activeHabits}
                    </p>
                    <p className="text-xs text-white/40 mt-1">
                        {activeHabits === 0 ? 'No habits yet' : `${activeHabits} habit${activeHabits > 1 ? 's' : ''} tracked`}
                    </p>
                </Card>
            </div>

            <div className="mt-6">
                <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s tasks</h2>
                {tasks.length === 0 ? (
                    <Card>
                        <p className="text-white/40 text-sm">
                            No tasks today.{' '}
                            <Link href="/habits" className="text-violet-400 hover:text-violet-300">
                                Add habits first →
                            </Link>
                        </p>
                    </Card>
                ) : (
                    <div className="flex flex-col gap-2">
                        {tasks.map((task) => {
                            const lifeArea = LIFE_AREAS.find((a) => a.key === task.habits?.area)
                            return (
                                <Card key={task.id} className={task.completed ? 'opacity-50' : ''}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                                            task.completed ? 'bg-violet-500 border-violet-500' : 'border-white/30'
                                        }`}>
                                            {task.completed && <span className="text-white text-xs">✓</span>}
                                        </div>
                                        <div>
                                            <p className={`text-sm font-medium ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                                                {task.habits?.title}
                                            </p>
                                            <p className="text-xs text-white/40">
                                                {lifeArea?.emoji} {lifeArea?.label}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                        <Link href="/tasks" className="mt-1 text-center text-xs text-violet-400 hover:text-violet-300 transition-colors">
                            Go to tasks →
                        </Link>
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}