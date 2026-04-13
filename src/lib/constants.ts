
import { LifeArea } from "@/types"

export const LIFE_AREAS: {
    key: LifeArea
    label: string
    color: string
    emoji: string
}[] = [
  { key: 'health',        label: 'Health',        color: '#4ade80', emoji: '💪' },
  { key: 'work',          label: 'Work',          color: '#60a5fa', emoji: '💼' },
  { key: 'family',        label: 'Family',        color: '#f97316', emoji: '👨‍👩‍👧' },
  { key: 'friends',       label: 'Friends',       color: '#a78bfa', emoji: '👫' },
  { key: 'finances',      label: 'Finances',      color: '#fbbf24', emoji: '💰' },
  { key: 'growth',        label: 'Growth',        color: '#34d399', emoji: '🌱' },
  { key: 'leisure',       label: 'Leisure',       color: '#f472b6', emoji: '🎯' },
  { key: 'relationships', label: 'Relationships', color: '#fb7185', emoji: '❤️' },
]

export const XP_VALUES = {
    complete_task: 10,
    complete_day: 25,
    streak_7: 50,
    streak_30: 200,
    complete_habit: 100,
}

export const LEVELS = [
    { level: 1, min_xp: 0,    label: 'Beginner' },
  { level: 2, min_xp: 100,  label: 'Apprentice' },
  { level: 3, min_xp: 300,  label: 'Consistent' },
  { level: 4, min_xp: 600,  label: 'Disciplined' },
  { level: 5, min_xp: 1000, label: 'Master' },
]

export const MOTIVATIONAL_MESSAGES = [
  'Day 1 – Every journey starts with a single step.',
  'Small steps every day build big results.',
  'You are building discipline.',
  'Consistency is your superpower.',
  'Keep going. You are doing great.',
]