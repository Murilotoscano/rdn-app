import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const apiKey = req.headers.get('x-api-key') || process.env.GEMINI_API_KEY;
        if (!apiKey) {
            return NextResponse.json({
                error: 'Gemini API key is required. Please set it in your environment or provide it in the API settings.'
            }, { status: 401 });
        }

        const body = await req.json();
        const { concept, originalQuestion, domain, topic, subtopic } = body;

        if (!concept || !originalQuestion) {
            return NextResponse.json({ error: 'Concept and originalQuestion are required' }, { status: 400 });
        }

        const systemPrompt = `You are a professional RDN exam writer aligned with the Commission on Dietetic Registration (CDR) 2022-2026 RD Exam blueprint.
Your task is to generate exactly 10 original, high-quality multiple-choice practice questions testing the following concept: "${concept}".
The original question that tested this concept was: "${originalQuestion}".

Guidelines:
1. DO NOT copy the exact wording, scenarios, or options of the original question.
2. Test the exact same core concept from a different practical exam angle.
3. For calculations, change the values, scenarios, and results, but keep the underlying math correct.
4. For clinical or foodservice, use different client profiles, medical histories, or administrative problems.
5. All questions must match the RDN exam format: clear, concise, objective, with exactly 4 options.
6. Provide a detailed explanation, including a breakdown of why the correct answer is correct, and why each of the other three wrong options is incorrect.
7. Return the results in a structured JSON object.

Format the output strictly as a JSON object with a single root key "questions" containing an array of 10 objects, each having the following structure:
{
  "id": "string (unique ID starting with 'sim-')",
  "domain": "string (the domain, e.g., '${domain || ''}')",
  "topic": "string (the topic, e.g., '${topic || ''}')",
  "subtopic": "string (the subtopic, e.g., '${subtopic || ''}')",
  "difficulty": "string ('easy' | 'medium' | 'hard')",
  "text": "string (the question stem)",
  "options": ["string", "string", "string", "string"], // exactly 4 options
  "correctIndex": number (0 to 3),
  "explanation": "string (overall explanation and formula if applicable)",
  "rationale": "string (must explicitly explain: A: [why correct/incorrect], B: [why correct/incorrect], C: [why correct/incorrect], D: [why correct/incorrect])",
  "references": ["string (suggested study reference book or guidelines)"]
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: systemPrompt
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseMimeType: 'application/json'
                }
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Gemini API error: ${response.status} - ${errText}`);
        }

        const resData = await response.json();
        const generatedText = resData.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
            throw new Error('No content returned from Gemini');
        }

        const resultJson = JSON.parse(generatedText.trim());
        return NextResponse.json(resultJson);

    } catch (error: any) {
        console.error('Error generating questions:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate questions' }, { status: 500 });
    }
}
