export type LifeArea = 
    | 'health'
    | 'work'
    | 'family'
    | 'friends'
    | 'finances'
    | 'growth'
    | 'leisure'
    | 'relationships'


    export interface User {
    id: string
    name: string
    email: string
    avatar?: string
    xp: number
    level: number
    created_at: string
    }

    export interface Habit {
    id: string
    user_id: string
    area: LifeArea
    name: string
    description: string
    difficulty: 'easy' | 'medium' | 'hard'
    duration_days: number
    created_at: string  
    }

    export interface DailyTask {
    id: string
    habit_id: string
    day_number: number
    description: string
    completed: boolean
    date: string
    }

    export interface Progress {
    id: string
    habit_id: string
    date: string
    completed: boolean
    notes?: string
    }

    export interface LifeWheel {
    id: string
    user_id: string
    health: number
    work: number
    family: number
    friends: number
    finances: number
    growth: number
    leisure: number
    relationships: number
    created_at: string
    }

    export interface Achievement {
    id: string
    user_id: string
    badge_type: string
    unlocked_at: string
    }