
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { ProgressBar } from "@/components/ui/ProgressBar"



export default function DashboardPage() {
  return (
      <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-white/40">Your progress today</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="text-2xl font-bold text-white">7</p>
              <p className="text-xs text-white/40">day streak</p>
            </div>
          </div>
        </Card>

        <Card>
          <p className="text-sm text-white/40 mb-1">Monthly progress</p>
          <p className="text-2xl font-bold text-white mb-3">68%</p>
          <ProgressBar value={68} />
        </Card>

        <Card>
          <p className="text-sm text-white/40 mb-1">Active habits</p>
          <p className="text-2xl font-bold text-white">3</p>
          <p className="text-xs text-white/40 mt-1">English • Gym • Reading</p>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-white mb-4">Today&apos;s tasks</h2>
        <Card>
          <p className="text-white/40 text-sm">Connect Supabase to see your tasks</p>
        </Card>
      </div>
    </PageWrapper>
  )
}