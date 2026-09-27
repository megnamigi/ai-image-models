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
      model: "gemini-3.6-flash",
      contents: `
Identify the ingredients in the following food description.

Food:
${description}

Return only a simple list of ingredients.
Do not include explanations.
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
