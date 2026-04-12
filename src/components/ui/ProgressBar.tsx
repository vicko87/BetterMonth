import { cn } from '@/lib/utils' 

interface ProgressBarProps {
    value: number
    max?: number
    color?: string
    className?: string
}

export function ProgressBar({ value, max = 100, color = '#a78bfa', className }: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100)

  return (
    <div className={cn('h-2 w-full rounded-full bg-white/10', className)}>
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{ width: `${percentage}%`, backgroundColor: color }}
      />
    </div>
  )
}