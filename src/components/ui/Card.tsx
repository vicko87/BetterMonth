import { cn } from "@/lib/utils";

interface CardProps {
    className?: string
    children: React.ReactNode
}

export function Card({ className, children }: CardProps) {
     return (
    <div className={cn('rounded-2xl bg-white/5 border border-white/10 p-5', className)}>
      {children}
    </div>
  )
}