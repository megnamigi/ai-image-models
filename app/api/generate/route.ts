import { InferenceClient } from "@huggingface/inference";
import { NextResponse } from "next/server";

const client = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const image = await client.textToImage({
      model: "black-forest-labs/FLUX.1-schnell",
      inputs: `Realistic professional food photography of ${prompt}`,
      parameters: {
        num_inference_steps: 4,
      },
    });

    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      image: `data:image/jpeg;base64,${base64}`,
    });
  } catch (error) {
    console.error("Hugging Face image generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}