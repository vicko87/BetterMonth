'use client'

import { useState } from "react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { Badge } from "@/components/ui/Badge"
import { cn } from "@/lib/utils"




const MOCK_TASKS = [
    { id: '1', area: 'work',   color: '#60a5fa', label: 'Work',    description: 'Write 500 words in English',        completed: false },
  { id: '2', area: 'health', color: '#4ade80', label: 'Health',  description: 'Walk 8000 steps',                   completed: false },
  { id: '3', area: 'growth', color: '#34d399', label: 'Growth',  description: 'Read 20 pages',                     completed: true  },
]


export default function TasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS)

  function toggleTask(id: string) {
    setTasks((prev) =>
        prev.map((task) =>
            task.id === id ? { ...task, completed: !task.completed } : task
        )
    )
}

const completed = tasks.filter((t) => t.completed).length
return (
    <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Today&apos;s tasks</h1>
        <p className="text-white/40">{completed}/{tasks.length} completed</p>
      </div>

      <div className="flex flex-col gap-3">
        {tasks.map((task) => (
          <Card key={task.id} className={cn(task.completed && 'opacity-50')}>
            <div className="flex items-center gap-4">
              <button
                onClick={() => toggleTask(task.id)}
                className={cn(
                  'flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                  task.completed
                    ? 'border-violet-500 bg-violet-500 text-white'
                    : 'border-white/20 hover:border-violet-400'
                )}
              >
                {task.completed && <span className="text-sm">✓</span>}
              </button>
              <div className="flex-1">
                <p className={cn('text-sm font-medium', task.completed ? 'text-white/30 line-through' : 'text-white')}>
                  {task.description}
                </p>
              </div>
              <Badge label={task.label} color={task.color} />
            </div>
          </Card>
        ))}
      </div>
    </PageWrapper>
  )
}