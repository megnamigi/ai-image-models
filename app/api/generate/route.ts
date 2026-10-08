import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Pollinations API key is missing" },
        { status: 500 }
      );
    }

    const description = `Realistic professional food photography of ${prompt.trim()}`;

    const url = new URL(
      `https://gen.pollinations.ai/image/${encodeURIComponent(description)}`
    );

    url.searchParams.set("model", "flux");
    url.searchParams.set("width", "1024");
    url.searchParams.set("height", "1024");
    url.searchParams.set("seed", String(Math.floor(Math.random() * 1000000000)));

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("Pollinations error:", response.status, details);

      return NextResponse.json(
        {
          error:
            response.status === 402
              ? "Not enough Pollen credits to generate an image"
              : `Image generation failed (${response.status})`,
        },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type") || "image/jpeg";

    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: "API did not return an image" },
        { status: 502 }
      );
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const base64 = buffer.toString("base64");

    return NextResponse.json({
      image: `data:${contentType};base64,${base64}`,
    });
  } catch (error) {
    console.error("Image generation error:", error);

    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}