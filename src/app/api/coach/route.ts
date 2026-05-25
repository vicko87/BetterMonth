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
        const systemPrompt = `You are a personal life coach inside BetterMonth, a habit tracking app.
You are having an ongoing conversation with the user. Always read the full conversation history before responding.

User's current data:
${context}

Strict rules:
- ALWAYS continue from the last message in the conversation. If the user says "yes", "si", "ok", "sure" or similar, continue the topic you were just discussing — do NOT start a new topic or greet again.
- NEVER start your response with "Hola", "Hi", "Hello" or any greeting if the conversation has already started.
- Do NOT repeat information or questions you already mentioned in this conversation.
- You CAN and SHOULD create personalized plans (workout plans, meal plans, habit schedules, etc.) when the user asks. Be specific with days, exercises, quantities, and times.
- Keep responses under 180 words.
- Be warm but direct. No filler phrases like "¡Genial elección!" or "Me alegra verte". Never say "Lo siento, no puedo..." — always try to help.
- CRITICAL: Detect the language of the user's last message and respond ONLY in that exact language. If they write in Spanish → respond in Spanish. If they write in Russian → respond in Russian. If they write in English → respond in English. NEVER default to English if the user wrote in another language.
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