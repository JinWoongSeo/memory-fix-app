
import { NextResponse } from 'next/server';

// MOCK MODE: Set to true to bypass AI and use simulated results
const MOCK_MODE = true;

export async function POST(request: Request) {
    try {
        const { imageUrl, clothing } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is missing' }, { status: 400 });
        }

        // ===== MOCK MODE =====
        if (MOCK_MODE) {
            console.log('� MOCK MODE: Simulating AI processing...');
            console.log(`   Selected clothing: ${clothing}`);

            // Simulate processing delay (2-3 seconds)
            await new Promise(resolve => setTimeout(resolve, 2500));

            console.log('✅ MOCK MODE: Processing complete!');

            // Return the original image URL
            // In real mode, this would be the AI-generated result URL
            return NextResponse.json({
                result: imageUrl,
                mock: true,
                message: 'Mock mode: Returning original image. Real AI will generate clothing synthesis.'
            });
        }

        // ===== REAL MODE (Google Gemini / Replicate) =====
        // This code will run when MOCK_MODE = false
        const apiKey = process.env.GOOGLE_AI_API_KEY;
        if (!apiKey) {
            console.error("Missing GOOGLE_AI_API_KEY");
            return NextResponse.json({
                error: "Missing Google AI API Key",
                message: "Please add GOOGLE_AI_API_KEY to .env.local"
            }, { status: 500 });
        }

        // Real AI processing code here...
        return NextResponse.json({
            error: "Real mode not implemented yet. Use Replicate for production."
        }, { status: 501 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({
            error: "Failed to process image",
            details: String(error)
        }, { status: 500 });
    }
}
