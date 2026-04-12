import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";



interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost"
    size?: 'sm' | 'md' | 'lg'
}


export function Button({ variant = "primary", size = 'md', className, children, ...props }: ButtonProps) {
    return (
         <button
      className={cn(
        'rounded-xl font-semibold transition-all duration-200 active:scale-95',
        variant === 'primary' && 'bg-violet-600 text-white hover:bg-violet-700',
        variant === 'secondary' && 'bg-white/10 text-white hover:bg-white/20',
        variant === 'ghost' && 'text-white/70 hover:text-white',
        size === 'sm' && 'px-3 py-1.5 text-sm',
        size === 'md' && 'px-5 py-2.5 text-base',
        size === 'lg' && 'px-8 py-4 text-lg',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
    