import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useStreak() {
  const [streak, setStreak] = useState(0)
  const [todayProgress, setTodayProgress] = useState({ completed: 0, total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function calc() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const today = new Date().toISOString().split('T')[0]

      const { data: allTasks } = await supabase
        .from('daily_tasks')
        .select('date, completed')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (!allTasks || allTasks.length === 0) {
        setLoading(false)
        return
      }

      const todayTasks = allTasks.filter((t) => t.date === today)
      setTodayProgress({
        completed: todayTasks.filter((t) => t.completed).length,
        total: todayTasks.length,
      })

      const byDate = allTasks.reduce<Record<string, { total: number; done: number }>>((acc, t) => {
        if (!acc[t.date]) acc[t.date] = { total: 0, done: 0 }
        acc[t.date].total++
        if (t.completed) acc[t.date].done++
        return acc
      }, {})

      const completedDays = Object.entries(byDate)
        .filter(([, v]) => v.total > 0 && v.done === v.total)
        .map(([date]) => date)
        .sort()
        .reverse()

      let current = today
      let count = 0
      for (const date of completedDays) {
        if (date === current) {
          count++
          const d = new Date(current)
          d.setDate(d.getDate() - 1)
          current = d.toISOString().split('T')[0]
        } else {
          break
        }
      }

      setStreak(count)
      setLoading(false)
    }
    calc()
  }, [])

  return { streak, todayProgress, loading }
}