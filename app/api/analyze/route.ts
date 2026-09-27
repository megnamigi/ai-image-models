import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const image = formData.get("image") as File;

    if (!image) {
      return NextResponse.json(
        { error: "Image is required" },
        { status: 400 }
      );
    }

    const bytes = await image.arrayBuffer();
    const base64Image = Buffer.from(bytes).toString("base64");

    const response = await ai.models.generateContent({
        model: "gemini-3.5-flash-lite",
        
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Analyze this food image.

Please provide:
1. Food name
2. Visible ingredients
3. A short summary

Keep the answer clear and concise.
              `,
            },
            {
              inlineData: {
                mimeType: image.type,
                data: base64Image,
              },
            },
          ],
        },
      ],
    });

    return NextResponse.json({
      analysis: response.text,
    });
  } catch (error) {
    console.error("Image analysis error:", error);

    return NextResponse.json(
      { error: "Failed to analyze image" },
      { status: 500 }
    );
  }
}