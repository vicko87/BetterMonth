import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"




export interface DailyTask {
    id: string
    habit_id: string
    user_id: string
    date: string
    completed: boolean
    habits: {
        title: string
        area: string
    }
}

export function useTasks() {
    const [tasks, setTasks] = useState<DailyTask[]>([])
    const [loading, setLoading] = useState(true)

    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        async function initTasks() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            //obtener hábitos del usuario
            const todayDow = new Date().getDay() // 0=Dom, 1=Lun...6=Sab
            const { data: habits } = await supabase
                .from('habits')
                .select('id, days')
                .eq('user_id', user.id)

            // solo hábitos que incluyen hoy
            const habitsToday = (habits ?? []).filter(h =>
                !Array.isArray(h.days) || h.days.length === 0 || h.days.includes(todayDow)
            )

            if (habitsToday.length === 0) {
                setLoading(false)
                return
            }

            //crear tareas de hoy que no existen
            const taskRows = habitsToday.map((habit) => ({
                habit_id: habit.id,
                user_id: user.id,
                date: today,
            }))
            await supabase
                .from('daily_tasks')
                .upsert(taskRows, { onConflict: 'habit_id,date', ignoreDuplicates: true })

            //cargar tareas de hoy con nombre del hábito
            const { data: tasksData } = await supabase
                .from('daily_tasks')
                .select(`*, habits (title, area)`)
                .eq('user_id', user.id)
                .eq('date', today)  

                if (tasksData) setTasks(tasksData)
                setLoading(false)
        }
        initTasks()
    }, [today])

    async function toggleTask(id: string, completed: boolean) {
        await supabase.from('daily_tasks')
            .update({ completed: !completed })
            .eq('id', id)

        setTasks((prev) =>
            prev.map((t) =>
                t.id === id ? { ...t, completed: !completed } : t
            )
        )
    }

    return { tasks, loading, toggleTask }
}