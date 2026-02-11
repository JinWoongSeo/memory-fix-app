
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Gemini Client
const apiKey = process.env.GOOGLE_AI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
    try {
        if (!genAI) {
            console.error("❌ Stats: GOOGLE_AI_API_KEY is missing");
            return NextResponse.json({
                error: "Server configuration error",
                message: "GOOGLE_AI_API_KEY is missing"
            }, { status: 500 });
        }

        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is missing' }, { status: 400 });
        }

        console.log('🤖 Analyzing gender with Google Gemini 1.5 Flash...');

        // Convert base64 data URI to proper format for Gemini
        // imageUrl format: "data:image/jpeg;base64,/9j/4AAQSw..."
        const base64Data = imageUrl.split(',')[1];
        const mimeType = imageUrl.split(';')[0].split(':')[1];

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-001"
        });

        // Prompt for analysis
        const prompt = `
            Analyze the person in this image.
            Determine their gender based on visual features.
            Return a JSON object with the following structure:
            {
                "gender": "male" or "female",
                "confidence": number between 0.0 and 1.0,
                "reasoning": "brief explanation of visual cues"
            }
            If unsure or multiple people, pick the most prominent person.
        `;

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType: mimeType
            }
        };

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini Analysis Result:', text);

        let analysis;
        try {
            analysis = JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            // Fallback parsing if JSON is malformed
            const isMale = text.toLowerCase().includes("male") && !text.toLowerCase().includes("female");
            analysis = {
                gender: isMale ? 'male' : 'female',
                confidence: 0.8,
                reasoning: "Fallback parsing"
            };
        }

        // Normalize gender string
        const detectedGender = analysis.gender.toLowerCase().includes('female') ? 'female' : 'male';

        return NextResponse.json({
            gender: detectedGender,
            confidence: analysis.confidence || 0.9,
            reasoning: analysis.reasoning,
            raw: text
        });

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        const errorMessage = error instanceof Error ? error.message : String(error);
        return NextResponse.json({
            gender: 'female', // Safe fallback
            confidence: 0.0,
            error: errorMessage,
            fallback: true
        }, { status: 200 });
    }
}
