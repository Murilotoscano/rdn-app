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
        const { pdfText, pdfName, limit = 5 } = body;

        if (!pdfText || !pdfName) {
            return NextResponse.json({ error: 'pdfText and pdfName are required' }, { status: 400 });
        }

        const systemPrompt = `You are a professional RDN exam writer aligned with the Commission on Dietetic Registration (CDR) 2022-2026 RD Exam blueprint.
Your task is to analyze the following course material text from the PDF "${pdfName}", identify key exam-relevant concepts, and convert them into exactly ${limit} original RDN-style practice questions.

Study Material Text:
"""
${pdfText.substring(0, 40000)}
"""

Guidelines for Question Generation:
1. Identify the most exam-relevant concepts that are frequently tested in the RDN exam from the text.
2. Align each question with one of the official CDR domains (Domain I: Food and Nutrition Sciences, Domain II: Nutrition Care, Domain III: Management, Domain IV: Foodservice Systems).
3. Draft clear, professional question stems (text) that represent realistic scenarios (clinical, administrative, or practical).
4. Provide exactly 4 options (A, B, C, D) with only one unambiguously correct answer.
5. Provide a detailed explanation, including:
   - A general rationale for the correct answer.
   - An explicit explanation of why each of the other three wrong options is incorrect.
6. Identify the specific topic, subtopic, key concept tested, and the possible exam angle for each question.

Format the output strictly as a JSON object with a single root key "questions" containing an array of ${limit} objects, each having the following structure:
{
  "id": "string (unique ID starting with 'pdf-gen-')",
  "domain": "string (e.g., 'Domain I: Food and Nutrition Sciences')",
  "topic": "string",
  "subtopic": "string",
  "keyConcept": "string (the exact concept from the text)",
  "possibleExamAngle": "string (how this concept is tested on the RDN exam)",
  "text": "string (the question stem)",
  "options": ["string", "string", "string", "string"], // exactly 4 options
  "correctIndex": number (0 to 3),
  "explanation": "string (general explanation of correct answer)",
  "rationale": "string (must explicitly explain: A: [why correct/incorrect], B: [why correct/incorrect], C: [why correct/incorrect], D: [why correct/incorrect])",
  "sourcePdf": "string (use '${pdfName}')",
  "location": "string (estimate page or section reference based on the text context, e.g. 'Page 3')"
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
        console.error('Error generating questions from PDF:', error);
        return NextResponse.json({ error: error.message || 'Failed to generate questions' }, { status: 500 });
    }
}
