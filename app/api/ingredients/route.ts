import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { description } = await request.json();

    if (!description?.trim()) {
      return NextResponse.json(
        { error: "Food description is required" },
        { status: 400 }
      );
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
Identify the ingredients in the following food description.

Food:
${description}

Return the result in exactly this format:

Here's a quick summary of the ingredients you used:

• ingredient 1
• ingredient 2
• ingredient 3

Simple, classic, and delicious!

Do not add markdown symbols such as ** or #.
`,
    });

    return NextResponse.json({
      ingredients: response.text,
    });
  } catch (error) {
    console.error("Ingredient recognition error:", error);

    return NextResponse.json(
      { error: "Failed to identify ingredients" },
      { status: 500 }
    );
  }
}
