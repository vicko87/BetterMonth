import { supabase } from "@/lib/supabaseClient"
import { LifeArea } from "@/types"
import { useEffect, useState, useCallback } from "react"

type LifeWheelValues = Record<LifeArea, number>

const DEFAULT: LifeWheelValues = {
  health: 5, work: 5, family: 5, friends: 5,
  finances: 5, growth: 5, leisure: 5, relationships: 5,
}

export function useLifeWheel() {
  const [values, setValues] = useState<LifeWheelValues>(DEFAULT)
  const [autoAreas, setAutoAreas] = useState<LifeArea[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function calculate() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // 1. Cargar valores manuales guardados
      const { data: manual } = await supabase
        .from('life_wheel_entries')
        .select('health, work, family, friends, finances, growth, leisure, relationships')
        .eq('user_id', user.id)
        .maybeSingle()

      const baseValues = manual ? (manual as LifeWheelValues) : { ...DEFAULT }

      // 2. Cargar hábitos para calcular áreas automáticas
      const { data: habits } = await supabase
        .from('habits')
        .select('id, area')

      if (!habits || habits.length === 0) {
        setValues(baseValues)
        setLoading(false)
        return
      }

      const habitIds = habits.map((h) => h.id)
      const { data: tasks } = await supabase
        .from('daily_tasks')
        .select('habit_id, completed')
        .in('habit_id', habitIds)

      // 3. Calcular stats por área
      const stats: Record<string, { total: number; completed: number }> = {}
      for (const habit of habits) {
        const area = habit.area as LifeArea
        if (!stats[area]) stats[area] = { total: 0, completed: 0 }
        const habitTasks = tasks?.filter((t) => t.habit_id === habit.id) ?? []
        stats[area].total += habitTasks.length
        stats[area].completed += habitTasks.filter((t) => t.completed).length
      }

      // 4. Mezclar: auto para áreas con hábitos, manual para el resto
      const newValues = { ...baseValues }
      const detectedAutoAreas: LifeArea[] = []

      for (const [area, s] of Object.entries(stats)) {
        detectedAutoAreas.push(area as LifeArea)
        if (s.total === 0) {
          newValues[area as LifeArea] = 1
        } else {
          const pct = s.completed / s.total
          newValues[area as LifeArea] = Math.max(1, Math.round(pct * 10))
        }
      }

      setAutoAreas(detectedAutoAreas)
      setValues(newValues)
      setLoading(false)
    }

    calculate()
  }, [])

  const updateValue = useCallback((key: LifeArea, value: number) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }, [])

  const save = useCallback(async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }

    await supabase
      .from('life_wheel_entries')
      .upsert({ user_id: user.id, ...values, updated_at: new Date() }, { onConflict: 'user_id' })

    setSaving(false)
  }, [values])

  return { values, autoAreas, loading, saving, updateValue, save }
}