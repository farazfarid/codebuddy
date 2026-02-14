import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(req: Request) {
    try {
        const { code, language, apiKey } = await req.json();

        if (!code) {
            return NextResponse.json(
                { error: 'Code is required.' },
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

        const systemPrompt = `You are an expert senior developer and code reviewer. Review the provided ${language || 'code'} code.
    Your output must be a valid JSON object with the following structure:
    {
      "issues": [
        { "line": number, "message": "description of the issue", "severity": "low" | "medium" | "high" }
      ],
      "refactoredCode": "the full refactored code string",
      "explanation": "summary of changes and advice"
    }
    Focus on code quality, security, performance, and best practices.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: code },
            ],
            response_format: { type: "json_object" },
        });

        const content = completion.choices[0].message.content;

        if (!content) {
            throw new Error("No content received from OpenAI");
        }

        const feedbackJson = JSON.parse(content);

        return NextResponse.json(feedbackJson);

    } catch (error: any) {
        console.error("Error in review API:", error);
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
