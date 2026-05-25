import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'


export type Badge = {
    id: string
    emoji: string
    title: string
    description: string
    unlocked: boolean
}

export function useBadges() {
    const [badges, setBadges] = useState<Badge[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function calculate() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setLoading(false); return }

            const { data: tasks } = await supabase
                .from('daily_tasks')
                .select('date, completed')
                .eq('user_id', user.id)

            const { data: wheelEntries } = await supabase
                .from('life_wheel_entries')
                .select('health, work, family, friends, finances, growth, leisure, relationships')
                .eq('user_id', user.id)
                .maybeSingle()

            // --- Badge 1: First week complete 🏆 ---
            const byDate: Record<string, { total: number; done: number }> = {}
            for (const t of tasks ?? []) {
                if (!byDate[t.date]) byDate[t.date] = { total: 0, done: 0 }
                byDate[t.date].total++
                if (t.completed) byDate[t.date].done++
            }
            const completedDays = Object.values(byDate).filter(
                (d) => d.total > 0 && d.done === d.total
            )
            const firstWeek = completedDays.length >= 7

            // --- Badge 2: 7-day streak 🔥 ---
            const today = new Date().toISOString().split('T')[0]
            const sortedDates = Object.entries(byDate)
                .filter(([, v]) => v.total > 0 && v.done === v.total)
                .map(([date]) => date)
                .sort()
                .reverse()

            let current = today
            let streak = 0
            for (const date of sortedDates) {
                if (date === current) {
                    streak++
                    const d = new Date(current)
                    d.setDate(d.getDate() - 1)
                    current = d.toISOString().split('T')[0]
                } else {
                    break
                }
            }
            const streak7 = streak >= 7

            // --- Badge 3: Balanced Life Wheel ⚖️ ---
            let balanced = false
            if (wheelEntries) {
                const values = Object.values(wheelEntries) as number[]
                const min = Math.min(...values)
                const max = Math.max(...values)
                balanced = values.length === 8 && min >= 3 && (max - min) <= 3
            }

            setBadges([
                {
                    id: 'first_week',
                    emoji: '🏆',
                    title: 'First week complete',
                    description: '7 days with all tasks completed',
                    unlocked: firstWeek,
                },
                {
                    id: 'streak_7',
                    emoji: '🔥',
                    title: '7-day streak',
                    description: '7 days in a row completing everything',
                    unlocked: streak7,
                },
                {
                    id: 'balanced_wheel',
                    emoji: '⚖️',
                    title: 'Balanced Life Wheel',
                    description: 'All life areas balanced',
                    unlocked: balanced,
                },
            ])
            setLoading(false)
        }

        calculate()
    }, [])

    return { badges, loading }
}