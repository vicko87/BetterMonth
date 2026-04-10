
import { LifeArea } from "@/types"

export const LIFE_AREAS: {
    key: LifeArea
    label: string
    color: string
    emoji: string
}[] = [
  { key: 'health',        label: 'Salud',       color: '#4ade80', emoji: '💪' },
  { key: 'work',          label: 'Trabajo',     color: '#60a5fa', emoji: '💼' },
  { key: 'family',        label: 'Familia',     color: '#f97316', emoji: '👨‍👩‍👧' },
  { key: 'friends',       label: 'Amigos',      color: '#a78bfa', emoji: '👫' },
  { key: 'finances',      label: 'Finanzas',    color: '#fbbf24', emoji: '💰' },
  { key: 'growth',        label: 'Crecimiento', color: '#34d399', emoji: '🌱' },
  { key: 'leisure',       label: 'Ocio',        color: '#f472b6', emoji: '🎯' },
  { key: 'relationships', label: 'Amor',        color: '#fb7185', emoji: '❤️' },
]

export const XP_VALUES = {
    complete_task: 10,
    complete_day: 25,
    streak_7: 50,
    streak_30: 200,
    complete_habit: 100,
}

export const LEVELS = [
    { level: 1, min_xp: 0,    label: 'Principiante' },
  { level: 2, min_xp: 100,  label: 'Aprendiz' },
  { level: 3, min_xp: 300,  label: 'Constante' },
  { level: 4, min_xp: 600,  label: 'Disciplinado' },
  { level: 5, min_xp: 1000, label: 'Maestro' },
]

export const MOTIVATIONAL_MESSAGES = [
  'Day 1 – Every journey starts with a single step.',
  'Small steps every day build big results.',
  'You are building discipline.',
  'Consistency is your superpower.',
  'Keep going. You are doing great.',
]