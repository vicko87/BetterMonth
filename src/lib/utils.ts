export function cn(...classes: (string | undefined | null | false)[]): string {
    return classes.filter(Boolean).join(' ')
}

export function calculateLevel(xp: number): number {
    if (xp >= 1000) return 5
    if (xp >= 600) return 4
    if (xp >= 300) return 3
    if (xp >= 100) return 2
    return 1
}

export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0]
}

export function getDayNumber(startDate: string): number {
    const start = new Date(startDate)
    const today = new Date()
    const diff = today.getTime() - start.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
}