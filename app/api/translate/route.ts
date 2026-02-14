import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { code, sourceLanguage, targetLanguage, apiKey } = await req.json();

        if (!code || !targetLanguage) {
            return NextResponse.json(
                { error: 'Code and target language are required.' },
                { status: 400 }
            );
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: 'API Key is required.' },
                { status: 401 }
            );
        }

        const openai = new OpenAI({
            apiKey: apiKey,
        });

        const systemPrompt = `You are an expert senior developer and code translator. 
    Translate the provided code from ${sourceLanguage || 'auto-detect'} to ${targetLanguage}.
    
    Rules:
    1. Preserve the logic and functionality of the original code.
    2. Use idiomatic patterns and best practices for the target language.
    3. Add comments explaining complex translations only if absolutely necessary within the code itself.
    4. CRITICAL: Return ONLY the raw code. NO markdown formatting, NO code blocks (e.g. \`\`\`python), and NO explanation text. Just the code string.
    `;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: code },
            ],
        });

        const translatedCode = completion.choices[0].message.content;

        if (!translatedCode) {
            throw new Error("No content received from OpenAI");
        }

        return NextResponse.json({ translatedCode });

    } catch (error: any) {
        console.error("Error in translate API:", error);
        // Handle auth errors specifically
        if (error.status === 401) {
            return NextResponse.json(
                { error: 'Invalid API Key.' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: error.message || 'An unexpected error occurred.' },
            { status: 500 }
        );
    }
}
