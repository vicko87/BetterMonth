import { supabase } from "@/lib/supabaseClient";
import { LifeArea } from "@/types";
import { useEffect, useState } from "react";



type LifeWheelValues = Record<LifeArea, number>

const DEFAULT: LifeWheelValues = {
    health: 5, work: 5, family: 5, friends: 5,
    finances: 5, growth: 5, leisure: 5, relationships: 5,
}

export function useLifeWheel() {
    const [values, setValues] = useState<LifeWheelValues>(DEFAULT)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    useEffect(() => {
        async function fetchValues() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {setLoading(false); return}

            const { data} = await supabase
            .from('life_wheel_entries')
            .select('health, work, family, friends, finances, growth, leisure, relationships')
            .eq('user_id', user.id)
            .single()

            if (data) setValues(data as LifeWheelValues)
            setLoading(false)
        }
        fetchValues()
    }, [])


    function updateValue(key: LifeArea, value: number) {
        setValues((prev) => ({ ...prev, [key]: value }))
    }

    async function save() {
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {setSaving(false); return}

        await supabase
        .from('life_wheel_entries')
        .upsert(
            { user_id: user.id, ...values, updated_at: new Date() },
            { onConflict: 'user_id' }
            )
        setSaving(false)
    }

    return { values, loading, saving, updateValue, save }
}