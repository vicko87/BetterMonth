'use client'

import { useState, useRef, useEffect } from "react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { supabase } from "@/lib/supabaseClient"

type Message = {
    role: 'user' | 'assistant'
    content: string
}

export default function CoachPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [historyLoading, setHistoryLoading] = useState(true)
    const bottomRef = useRef<HTMLDivElement>(null)

    // Cargar historial de Supabase al montar
    useEffect(() => {
        async function loadHistory() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) { setHistoryLoading(false); return }

            const { data } = await supabase
                .from('coach_messages')
                .select('role, content')
                .eq('user_id', user.id)
                .order('created_at', { ascending: true })
                .limit(50)

            if (data && data.length > 0) {
                setMessages(data as Message[])
            } else {
                setMessages([{
                    role: 'assistant',
                    content: "Hi! I'm your personal coach 🤖 Ask me anything about your habits, life balance, or what to improve next.",
                }])
            }
            setHistoryLoading(false)
        }
        loadHistory()
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        const newMessages: Message[] = [...messages, { role: 'user', content: userMessage }]
        setMessages(newMessages)
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        let context = 'No data available.'

        if (user) {
            const [{ data: habits }, { data: wheel }, { data: tasks }] = await Promise.all([
                supabase.from('habits').select('title, area').eq('user_id', user.id),
                supabase.from('life_wheel_entries').select('health, work, family, friends, finances, growth, leisure, relationships').eq('user_id', user.id).maybeSingle(),
                supabase.from('daily_tasks').select('date, completed').eq('user_id', user.id),
            ])

            const todayDone = tasks?.filter((t) => t.completed).length ?? 0
            const todayTotal = tasks?.length ?? 0

            const wheelText = wheel
                ? Object.entries(wheel).map(([k, v]) => `${k}: ${v}`).join(', ')
                : 'No entries'

            context = `
            Habits: ${habits?.map((h) => `${h.title} (${h.area})`).join(', ') || 'None'}
            Life Wheel: ${wheelText}
            Today's Tasks: ${todayDone}/${todayTotal} completed
            `.trim()

            // Guardar mensaje del usuario en Supabase
            await supabase.from('coach_messages').insert({
                user_id: user.id,
                role: 'user',
                content: userMessage,
            })
        }

        try {
            const res = await fetch('/api/coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    context,
                    history: messages, // historial previo sin el mensaje actual
                }),
            })
            const data = await res.json()
            const reply = data.reply ?? "Sorry, something went wrong."

            setMessages((prev) => [...prev, { role: 'assistant', content: reply }])

            // Guardar respuesta del coach en Supabase
            if (user) {
                await supabase.from('coach_messages').insert({
                    user_id: user.id,
                    role: 'assistant',
                    content: reply,
                })
            }
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again later." }])
        }
        setLoading(false)
    }

    async function clearHistory() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return
        await supabase.from('coach_messages').delete().eq('user_id', user.id)
        setMessages([{
            role: 'assistant',
            content: "Hi! I'm your personal coach 🤖 Ask me anything about your habits, life balance, or what to improve next.",
        }])
    }

    return (
        <PageWrapper>
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">AI Coach 🤖</h1>
                    <p className="text-white/40">Ask anything about your habits and progress</p>
                </div>
                {messages.length > 1 && (
                    <button
                        onClick={clearHistory}
                        className="text-xs text-white/30 hover:text-red-400 transition-colors"
                    >
                        Clear history
                    </button>
                )}
            </div>

            <Card className="flex flex-col gap-3 mb-4 max-h-[60vh] overflow-y-auto">
                {historyLoading ? (
                    <p className="text-white/30 text-sm text-center py-4">Loading history...</p>
                ) : (
                    messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-white/10 text-white/90'
                            }`}>
                                {msg.content}
                            </div>
                        </div>
                    ))
                )}
                {loading && (
                    <div className="flex justify-start">
                        <div className="bg-white/10 rounded-2xl px-4 py-2 text-sm text-white/40">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </Card>

            <form onSubmit={sendMessage} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask your coach..."
                    className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-white/20 outline-none focus:border-violet-500 transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-40 px-5 py-3 text-white font-medium transition-colors"
                >
                    Send
                </button>
            </form>
        </PageWrapper>
    )
}