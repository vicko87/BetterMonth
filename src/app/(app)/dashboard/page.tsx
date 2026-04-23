'use client'
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"
import { useHabits } from "@/hooks/useHabits"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"




export default function DashboardPage() {
    const {habits, loading} = useHabits()
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
    const habitNames = habits.slice(0, 3).map((h) => h.title).join(' • ')
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
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-white/40">day streak</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-white/40 mb-1">Monthly progress</p>
          <p className="text-2xl font-bold text-white mb-3">0%</p>
          <ProgressBar value={0} />
        </Card>

        <Card>
          <p className="text-sm text-white/40 mb-1">Active habits</p>
          <p className="text-2xl font-bold text-white">
            {loading ? '...' : activeHabits}
          </p>
          <p className="text-xs text-white/40 mt-1">
            {activeHabits === 0 ? 'No habits yet' : habitNames}
          </p>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s tasks</h2>
        <Card>
          {activeHabits === 0 ? (
            <p className="text-white/40 text-sm">Add habits to see your daily tasks</p>
          ) : (
            <p className="text-white/40 text-sm">You have {activeHabits} active habits today</p>
          )}
        </Card>
      </div>
    </PageWrapper>
  )
}