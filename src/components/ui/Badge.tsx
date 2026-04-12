import { cn } from '@/lib/utils'

interface BadgeProps {
    label: string
    color?: string
    className?: string
}
export function Badge({ label, color = '#a78bfa', className }: BadgeProps) {
  return (
    <span
      className={cn('inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold', className)}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  )
}