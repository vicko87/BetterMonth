import { NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY})

export async function POST(req: NextRequest) {
    try {
        const {tasks, habits} = await req.json()

      const systemPrompt = `You are a personal life coach inside BetterMonth.
Analyze the user's weekly data and generate a short, warm, motivating summary.
- Start with the overall completion percentage
- Mention the weakest area and give one specific tip
- Mention the strongest area as positive reinforcement
- Keep it under 80 words
- Respond in the same language the user's data is in`

const response = await groq.chat.completions.create({
    model: 'llama-3.1-8b-instant',
    messages: [
         { role: 'system', content: systemPrompt },
                { role: 'user', content: `Habits: ${habits}\nWeekly tasks by area: ${tasks}` },
            ],
            max_tokens: 200,
        })
        const summary = response.choices[0]?.message?.content ?? 'No summary available.'
        return NextResponse.json({ summary })
    } catch (error) {
        console.error('Weekly summary API error:', error)
        return NextResponse.json({ error: 'Failed to generate summary' }, { status: 500 })
    }
}