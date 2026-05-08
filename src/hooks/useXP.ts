import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { XP_VALUES, LEVELS } from "@/lib/constants"

export function useXP() {
  const [xp, setXp] = useState(0) //experiencia total de usuario
  const [level, setLevel] = useState(1)
  const [levelLabel, setLevelLabel] = useState('Beginner')
  const [xpToNext, setXpToNext] = useState(100)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function calculate() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: tasks } = await supabase
        .from('daily_tasks')
        .select('completed, date, habit_id')

      if (!tasks) { setLoading(false); return }

      const completedTasks = tasks.filter((t) => t.completed)
      let totalXP = completedTasks.length * XP_VALUES.complete_task

      const byDate: Record<string, { total: number; completed: number }> = {}
      for (const task of tasks) {
        if (!byDate[task.date]) byDate[task.date] = { total: 0, completed: 0 }
        byDate[task.date].total++
        if (task.completed) byDate[task.date].completed++
      }
      for (const day of Object.values(byDate)) {
        if (day.total > 0 && day.completed === day.total) {
          totalXP += XP_VALUES.complete_day
        }
      }

      const currentLevel = [...LEVELS]
        .reverse()
        .find((l) => totalXP >= l.min_xp) ?? LEVELS[0]

      const nextLevel = LEVELS.find((l) => l.level === currentLevel.level + 1)

      setXp(totalXP)
      setLevel(currentLevel.level)
      setLevelLabel(currentLevel.label)
      setXpToNext(nextLevel ? nextLevel.min_xp : currentLevel.min_xp)
      setLoading(false)
    }

    calculate()
  }, [])

  return { xp, level, levelLabel, xpToNext, loading }
}
