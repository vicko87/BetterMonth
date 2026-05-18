'use client'

import{ useState, useRef, useEffect} from "react"
import { PageWrapper } from "@/components/layout/PageWrapper"
import { Card } from "@/components/ui/Card"
import { supabase } from "@/lib/supabaseClient"



type Message = {
    role: 'user' | 'assistant'
    content: string
}

export default function CoachPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: "Hi! I'm your personal coach 🤖 Ask me anything about your habits, life balance, or what to improve next.",
        },
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    async function sendMessage(e: React.FormEvent) {
        e.preventDefault()
        if (!input.trim() || loading) return

        const userMessage = input.trim()
        setInput('')
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        const { data: { user } } = await supabase.auth.getUser()
        let context = 'No data available.'

        if (user) {
            const [{ data: habits}, { data: wheel}, { data: tasks}] = await Promise.all([
                supabase.from('habits').select('title, area').eq('user_id', user.id),
                supabase.from('life_wheel_entries').select('area, value').eq('user_id', user.id),
                supabase.from('daily_tasks').select('date, completed').eq('user_id', user.id),
            ])

            const todayDone = tasks?.filter((t) => t.completed).length ?? 0
            const todayTotal = tasks?.length ?? 0

            context = `
            Habits: ${habits?.map((h) => `${h.title} (${h.area})`).join(', ') || 'None'}
            Life Wheel: ${wheel?.map((w) => `${w.area}: ${w.value}`).join(', ') || 'No entries'}
            Today's Tasks: ${todayDone}/${todayTotal} completed
            `.trim()
        }

        try {
            const res = await fetch('/api/coach', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, context }),
            })
            const data = await res.json()
            setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])
        } catch {
            setMessages((prev) => [...prev, { role: 'assistant', content: "Sorry, something went wrong. Please try again later." }])
        }
        setLoading(false)
    }

    return (
         <PageWrapper>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">AI Coach 🤖</h1>
        <p className="text-white/40">Ask anything about your habits and progress</p>
      </div>

      <Card className="flex flex-col gap-3 mb-4 max-h-[60vh] overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                msg.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-white/10 text-white/90'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
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