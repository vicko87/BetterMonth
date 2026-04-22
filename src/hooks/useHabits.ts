import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"


export interface Habit {
    id: string
    title: string
    area: string
    frequency: string
    created_at: string
}

export function useHabits() {
    const [habits, setHabits] = useState<Habit[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchHabits() {
            const { data, error } = await supabase
                .from('habits')
                .select('*')
                .order('created_at', { ascending: false })

                if (!error && data) {
                    setHabits(data)
                }
                setLoading(false)
        }
        fetchHabits()
    }, [])

    return { habits, loading }
}