"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [foodDescription, setFoodDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);
      setError("");
      setImage("");

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setImage(data.image);
    } catch (error) {
      console.error(error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

const handleIngredients = async () => {
  if (!foodDescription.trim()) return;

  try {
    setIngredientsLoading(true);
    setIngredients("");

    const response = await fetch("/api/ingredients", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: foodDescription,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to identify ingredients");
    }

    setIngredients(data.ingredients);
  } catch (error) {
    console.error(error);
    setIngredients("Something went wrong. Please try again.");
  } finally {
    setIngredientsLoading(false);
  }
};

const handleAnalyze = async () => {
  if (!selectedImage) return;

  try {
    setAnalysisLoading(true);
    setAnalysis("");

    const formData = new FormData();
    formData.append("image", selectedImage);

    const response = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to analyze image");
    }

    setAnalysis(data.analysis);
  } catch (error) {
    console.error(error);
    setAnalysis("Something went wrong. Please try again.");
  } finally {
    setAnalysisLoading(false);
  }
};

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold tracking-tight">
            AI Image Models
          </h1>

          <p className="mt-3 text-gray-500">
            Create images from your ideas using AI.
          </p>
        </div>

        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Generate an image</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="prompt">
                Describe your image
              </Label>

              <Textarea
                id="prompt"
                placeholder="Example: A delicious pasta carbonara..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="min-h-[140px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              className="w-full"
              disabled={!prompt.trim() || loading}
            >
              {loading ? "Generating..." : "Generate Image"}
            </Button>

            {error && (
              <p className="text-center text-sm text-red-500">
                {error}
              </p>
            )}

            <div className="flex min-h-[300px] items-center justify-center overflow-hidden rounded-xl border border-dashed bg-gray-50">
              {loading ? (
                <p className="text-sm text-gray-400">
                  AI is creating your image...
                </p>
              ) : image ? (
                <img
                  src={image}
                  alt="AI generated image"
                  className="h-auto w-full rounded-xl object-cover"
                />
              ) : (
                <p className="text-sm text-gray-400">
                  Your generated image will appear here
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mx-auto mt-8 max-w-2xl">
  <CardHeader>
    <CardTitle>Ingredient Recognition</CardTitle>
  </CardHeader>

  <CardContent className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="foodDescription">
        Describe your food
      </Label>

      <Textarea
        id="foodDescription"
        placeholder="Example: Pasta carbonara with creamy sauce and bacon..."
        value={foodDescription}
        onChange={(e) => setFoodDescription(e.target.value)}
        className="min-h-[120px]"
      />
    </div>

    <Button
      onClick={handleIngredients}
      className="w-full"
      disabled={!foodDescription.trim() || ingredientsLoading}
    >
      {ingredientsLoading ? "Identifying..." : "Identify Ingredients"}
    </Button>

    {ingredients && (
      <div className="rounded-xl border bg-gray-50 p-5">
        <h3 className="mb-3 font-semibold">
          Identified Ingredients
        </h3>

        <p className="whitespace-pre-line text-sm text-gray-700">
          {ingredients}
        </p>
      </div>
    )}
  </CardContent>
</Card>

<Card className="mx-auto mt-8 max-w-2xl">
  <CardHeader>
    <CardTitle>Image Analysis</CardTitle>
  </CardHeader>

  <CardContent className="space-y-6">
    <div className="space-y-2">
      <Label htmlFor="foodImage">
        Upload a food image
      </Label>

      <Input
        id="foodImage"
        type="file"
        accept="image/png, image/jpeg"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            setSelectedImage(file);
            setAnalysis("");
          }
        }}
      />
    </div>

    {selectedImage && (
      <div className="rounded-xl border bg-gray-50 p-4">
        <p className="text-sm text-gray-600">
          Selected image: {selectedImage.name}
        </p>
      </div>
    )}

    <Button
      onClick={handleAnalyze}
      className="w-full"
      disabled={!selectedImage || analysisLoading}
    >
      {analysisLoading ? "Analyzing..." : "Analyze Image"}
    </Button>

    {analysis && (
      <div className="rounded-xl border bg-gray-50 p-5">
        <h3 className="mb-3 font-semibold">
          Image Analysis Result
        </h3>

        <p className="whitespace-pre-line text-sm text-gray-700">
          {analysis}
        </p>
      </div>
    )}
  </CardContent>
</Card>

      </div>
    </main>
  );
}
