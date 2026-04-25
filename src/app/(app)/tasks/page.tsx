'use client'

import { useTasks } from '@/hooks/useTasks'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Card } from '@/components/ui/Card'
import { LIFE_AREAS } from '@/lib/constants'

export default function TasksPage() {
  const { tasks, loading, toggleTask } = useTasks()

  const completed = tasks.filter((t) => t.completed).length
  const total = tasks.length

  return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Today&apos;s tasks</h1>
        <p className="text-white/40">
          {loading ? 'Loading...' : `${completed} of ${total} completed`}
        </p>
      </div>

      {!loading && tasks.length === 0 && (
        <Card>
          <p className="text-white/40 text-sm">No tasks today. Add habits first!</p>
        </Card>
      )}

      <div className="flex flex-col gap-3">
        {tasks.map((task) => {
          const lifeArea = LIFE_AREAS.find((a) => a.key === task.habits?.area)
          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id, task.completed)}
              className="w-full text-left"
            >
              <Card className={task.completed ? 'opacity-50' : ''}>
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.completed
                        ? 'bg-violet-500 border-violet-500'
                        : 'border-white/30'
                    }`}
                  >
                    {task.completed && <span className="text-white text-xs">✓</span>}
                  </div>
                  <div>
                    <p className={`font-medium ${task.completed ? 'line-through text-white/40' : 'text-white'}`}>
                      {task.habits?.title}
                    </p>
                    <p className="text-xs text-white/40">
                      {lifeArea?.emoji} {lifeArea?.label}
                    </p>
                  </div>
                </div>
              </Card>
            </button>
          )
        })}
      </div>
    </PageWrapper>
  )
}