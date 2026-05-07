import { useEffect, useCallback } from "react"
import { supabase } from "@/lib/supabaseClient"

export function useNotification() {

  const notify = useCallback(async () => {
    if (Notification.permission !== 'granted') return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: habits } = await supabase
      .from('habits')
      .select('title')

    const count = habits?.length ?? 0
    if (count === 0) return

    new Notification('BetterMonth 🔥', {
      body: `You have ${count} habit${count > 1 ? 's' : ''} to complete today. Keep the streak going!`,
      icon: '/icon.png',
    })
  }, [])

  const scheduleDaily = useCallback(() => {
    const now = new Date()
    const target = new Date()
    target.setHours(9, 0, 0, 0)

    if (now > target) {
      target.setDate(target.getDate() + 1)
    }

    const msUntilTarget = target.getTime() - now.getTime()

    setTimeout(async () => {
      await notify()
      setInterval(async () => {
        await notify()
      }, 24 * 60 * 60 * 1000)
    }, msUntilTarget)
  }, [notify])

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('Notification' in window)) return

    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }

    scheduleDaily()
  }, [scheduleDaily])
}