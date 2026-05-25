import {  NextRequest, NextResponse } from "next/server"
import Groq from "groq-sdk"

const openai = new Groq({
    apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
    try {
        const { message, context, lang, history } = await req.json();

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
        }

      
        const langMap: Record<string, string> = {
            spa: 'Spanish',
            eng: 'English',
            rus: 'Russian',
            fra: 'French',
            deu: 'German',
            ita: 'Italian',
            por: 'Portuguese',
            ukr: 'Ukrainian',
           
        };

        let languageHint = '';
        if (lang === 'spa') languageHint = 'Responde SOLO en español.';
        else if (lang === 'eng') languageHint = 'Respond ONLY in English.';
        else if (lang && langMap[lang]) languageHint = `Respond ONLY in ${langMap[lang]}.`;
        else if (lang && lang.length === 3) languageHint = `Respond ONLY in ${lang}.`;

        // Refuerza el prompt para consejos relevantes
        const systemPrompt = `You are a personal life coach assistant inside BetterMonth, a habit tracking app.
You help users improve their habits and life balance based on their personal data.

Here is the user's current data:
${context}

Guidelines:
- Be concise, warm, and motivating
- Give specific, actionable advice
- Reference the user's actual data when relevant
- If the user asks about a specific topic (e.g. weight loss, sports, reading), focus your advice on that topic
- Keep responses under 150 words
- Respond in the same language the user writes in
${languageHint}`;

        const historyMessages = (history ?? []).slice(-10).map((m: { role: string; content: string }) => ({
            role: m.role as 'user' | 'assistant',
            content: m.content,
        }))

        const response = await openai.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                ...historyMessages,
                { role: 'user', content: message },
            ],
            max_tokens: 300,
        });

        const reply = response.choices[0]?.message?.content ?? 'No response.';
        return NextResponse.json({ reply });
    } catch (error) {
        console.error('Coach API error:', error)
        return NextResponse.json({ error: 'Failed to get response from OpenAI' }, { status: 500 })
    }
}