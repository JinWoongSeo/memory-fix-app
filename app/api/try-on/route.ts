import { NextRequest, NextResponse } from 'next/server';
import { client } from "@gradio/client";

// Maximum execution time for Vercel Hobby tier is 10s (Serverless Function). 
// Edge functions have different limits but @gradio/client might not run on Edge.
// We need to be careful about timeouts. 
// If it times out, we might need a background job or client-side polling, 
// but for now we try a direct call (or user handles long loading).

export async function POST(req: NextRequest) {
    try {
        const { personImage, garmentType } = await req.json();

        if (!personImage || !garmentType) {
            return NextResponse.json({ error: 'Missing personImage or garmentType' }, { status: 400 });
        }

        // define garment image path
        let garmentUrl = '';
        if (garmentType === 'suit') {
            // In production, use absolute URL or read file
            // For Vercel, reading local file in API route can be tricky if not bundled.
            // Best to use a public URL if possible, or read from process.cwd()
            // For this demo, let's assume we can pass the URL of the placeholder we just made
            // But Gradio Client often needs a Blob or URL.
            // Let's rely on the public folder being served.
            // Ideally we pass a URL.
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            const host = req.headers.get('host');
            garmentUrl = `${protocol}://${host}/garments/suit.png`;
        } else if (garmentType === 'hanbok') {
            const protocol = req.headers.get('x-forwarded-proto') || 'http';
            const host = req.headers.get('host');
            garmentUrl = `${protocol}://${host}/garments/hanbok.png`;
        }

        console.log("Connecting to IDM-VTON...");
        const hfToken = process.env.HF_TOKEN;
        if (!hfToken) {
            console.warn("⚠️ HF_TOKEN is missing. Using anonymous quota which may be limited.");
        }

        const app = await client("yisol/IDM-VTON", { token: hfToken as `hf_${string}` });

        // The API expects:
        // 0: dict (background, layers) -> Person Image
        // 1: filepath (garm_img) -> Garment Image
        // 2: str (garment_des) -> Description
        // 3: bool (is_checked) -> Auto-masking (True)
        // 4: bool (is_checked_crop) -> Auto-crop (False)
        // 5: number (denoise_steps) -> 30
        // 6: number (seed) -> 42

        // Note: passing URLs to gradio client sometimes works, otherwise we need to fetch and pass Blob.
        // Let's try passing the data URL of the person image directly if supported, or fetch it.
        const personBlob = await (await fetch(personImage)).blob();
        const garmentBlob = await (await fetch(garmentUrl)).blob();

        const result = await app.predict("/tryon", [
            { "background": personBlob, "layers": [], "composite": null }, // Dict for Dict(background: filepath | None, layers: List[filepath] | None, composite: filepath | None)
            garmentBlob,
            "garment", // description
            true, // auto-masking
            false, // auto-crop
            30, // steps
            42 // seed
        ]);

        // Result is likely an array of data.
        // The endpoint returns [Output Image, Masked Image]
        const output = result.data as any[];
        // output[0] should be the result image (likely a helper object or URL)

        // Gradio client usually returns a result object that has 'url' or 'data'.
        // Let's inspect the structure in logs if needed, but standard is:
        // It might be a URL on the Gradio space.

        return NextResponse.json({ result: output[0]?.url || output[0] });

    } catch (error) {
        console.error('VTON Error:', error);
        return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
    }
}
