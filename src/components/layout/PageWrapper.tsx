import { cn } from '@/lib/utils'

interface PageWrapperProps {
    children: React.ReactNode
    className?: string
}

export function PageWrapper({ children, className }: PageWrapperProps) {
    return (
         <main className={cn('flex-1 p-6 pb-24 md:pb-6', className)}>
      {children}
    </main>
  )
}