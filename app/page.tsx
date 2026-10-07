"use client";

import { useEffect, useRef, useState } from "react";
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
import { Sparkles, RotateCcw, Trash2, FileText} from "lucide-react";

export default function Home() {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sentMessage, setSentMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<
  { role: "user" | "assistant"; text: string }[]
  >([]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatHistory, chatLoading]);

  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const [foodDescription, setFoodDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [ingredientsLoading, setIngredientsLoading] = useState(false);
  
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [analysisLoading, setAnalysisLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<
  "analysis" | "ingredients" | "creator"
>("analysis");

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

const handleChat = async () => {

if (!chatMessage.trim()) return;

const currentMessage = chatMessage;

setSentMessage(currentMessage);
setChatMessage("");

setChatHistory((prev) => [
  ...prev,
  {
    role: "user",
    text: currentMessage,
  },
]);

  try {
    setChatLoading(true);
    setChatResponse("");

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
      message: currentMessage,
    }), 

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Chat failed");
    }

    setChatResponse(data.reply);

    setChatHistory((prev) => [
      ...prev,
      {
        role: "assistant",
        text: data.reply,
      },
    ]);

  } catch (error) {
    console.error(error);
    setChatResponse("Sorry, something went wrong.");
  } finally {
    setChatLoading(false);
  }
};

  return (

        // IMAGE ANALYSIS
        
    <main className="min-h-screen bg-white px-12 py-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 border-b pb-4">
          <h1 className="text-base font-semibold text-black">
            AI tools
          </h1>
        </div>

    <div className="ml-[150px] mb-8 flex w-full max-w-[450px] rounded-lg bg-gray-100 p-1">
  <button
    onClick={() => setActiveTab("analysis")}
    className={`rounded-md px-4 py-1.5 text-sm font-medium ${
      activeTab === "analysis"
        ? "bg-white text-black shadow-sm"
        : "text-gray-400"
    }`}
  >
    Image Analysis
  </button>

  <button
    onClick={() => setActiveTab("ingredients")}
      className={`rounded-md px-4 py-1.5 text-sm font-medium ${
        activeTab === "ingredients"
          ? "bg-white text-black shadow-sm"
          : "text-gray-400"
        }`}
  >
    Ingredient recognition
  </button>

  <button
    onClick={() => setActiveTab("creator")}
      className={`rounded-md px-4 py-1.5 text-sm font-medium ${
        activeTab === "creator"
          ? "bg-white text-black shadow-sm"
          : "text-gray-400"
      }`}
  >
    Image creator
  </button>
</div>

{activeTab === "creator" && (

  <Card className="mr-auto ml-[110px] w-full max-w-[580px] bg-transparent shadow-none !ring-0">
          <CardHeader>
            <CardTitle>Generate an image</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4 px-0">
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
  )}

{activeTab === "ingredients" && (

    <div className="ml-[150px] mt-8 w-[580px]">
      <CardHeader className="px-0 pb-3">
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" strokeWidth={1.8} />
            <span>Ingredient recognition</span>
          </div>

          <button
            type="button"
            onClick={() => {
            setFoodDescription("");
            setIngredients("");
          }}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50"
          >
            <RotateCcw
              className="h-4 w-4 text-gray-400"
              strokeWidth={1.5}
            />
          </button>
        </CardTitle>
      </CardHeader>

  <CardContent className="space-y-4">
    <div className="space-y-2">
      <p className="text-sm font-normal text-gray-400">
        Describe the food, and AI will detect the ingredients.
      </p>

      <Textarea
        id="foodDescription"
        placeholder="Орц тодорхойлох"
        value={foodDescription}
        onChange={(e) => setFoodDescription(e.target.value)}
        className="min-h-[120px]"
      />
    </div>

    <div className="flex justify-end">
      <button
        type="button"
        onClick={handleIngredients}
        disabled={!foodDescription.trim() || ingredientsLoading}
        className={`h-9 w-[90px] rounded-md text-sm text-white transition-colors ${
          foodDescription.trim() && !ingredientsLoading
          ? "cursor-pointer bg-black"
          : "cursor-not-allowed bg-gray-400"
        }`}
      >
        {ingredientsLoading ? "Working..." : "Generate"}
      </button>
    </div>

    <div className="mt-8">
      <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
        <FileText className="h-5 w-5" strokeWidth={1.8} />
        Identified Ingredients
      </h3>

      {ingredients ? (
    <div className="rounded-md border border-gray-200 bg-white p-4">
      <div className="text-sm leading-6 text-gray-700">
        {ingredients.split("\n").map((line, index) => {
          const trimmedLine = line.trim();

          if (trimmedLine.startsWith("•")) {
            return (
              <p key={index} className="font-semibold">
                {line}
              </p>
            );
          }

          return (
            <p key={index} className={trimmedLine === "" ? "h-3" : ""}>
              {line}
            </p>
          );
        })}
      </div>
      
    </div>
  ) : (
    <p className="text-sm text-gray-400">
      First, enter your text to recognize an ingredients.
    </p>
  )}
</div>

    </CardContent>
  </div>
)}

{activeTab === "analysis" && (
    <Card className="mx-auto w-full max-w-[580px] bg-transparent shadow-none !ring-0">
      <CardHeader className="px-0 pb-3">
        <CardTitle className="flex items-center justify-between text-xl font-semibold">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-black" strokeWidth={1.5} />
            <span>Image analysis</span>
          </div>

          <button
            type="button"
            onClick={() => {
              setSelectedImage(null);
              setImagePreview("");
              setAnalysis("");
            }}

            className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white hover:bg-gray-50"  
          >
            <RotateCcw
              className="h-4 w-4 text-gray-400"
              strokeWidth={1.5}
            />
          </button>
        </CardTitle>
    </CardHeader>

  <CardContent className="space-y-4 px-0">
    <div className="space-y-3">
      <p className="text-sm font-normal text-gray-400">
        Upload a food photo, and AI will detect the ingredients.
      </p>

  <label
    htmlFor="foodImage"
    className={
      imagePreview
      ? "inline-flex cursor-pointer"
      : "flex min-h-[44px] cursor-pointer items-center rounded-md border border-gray-300 bg-white hover:bg-gray-50"
    } >
  {imagePreview ? (
  <div className="relative h-full w-full">
    <img
      src={imagePreview}
      alt="Food preview"
      className="h-[150px] w-[220px] rounded-md border object-cover"
    />

    <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setSelectedImage(null);
          setImagePreview("");
          setAnalysis("");
        }}
        className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-md border bg-white text-base text-black shadow-sm"
      >
        <Trash2 className="h-4 w-4 text-black" strokeWidth={1.5} />
      </button>
    </div>

) : (
  <div className="flex w-full items-center gap-3 px-4">
    <span className="font-medium text-black">
      Choose File
    </span>

    <span className="text-sm text-gray-400">
      JPG , PNG
    </span>
  </div>
)}

    <Input
      id="foodImage"
      type="file"
      accept="image/png, image/jpeg"
      className="hidden"
      onChange={(e) => {
      const file = e.target.files?.[0];

         if (file) {
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
            setAnalysis("");
          }
        }}
      />
     </label>
    </div>
  
    <div className="mt-4 flex justify-end -mt-2 pr-[120px]">
      <Button
        onClick={handleAnalyze}
        className="w-[120px]"
        disabled={!selectedImage || analysisLoading}
      >
        {analysisLoading ? "Generate" : "Generate"}
      </Button>
    </div>

 <div className="mt-4">
        <div className="mt-2">
        <h3 className="mb-3 flex items-center gap-2 text-lg font-semibold">
          <FileText className="h-5 w-5" strokeWidth={1.8} />
          Here is the summary
        </h3>

        {!analysis && (
          <p className="text-sm text-gray-400">
            First, enter your image to recognize an ingredients.
        </p>
        )}

        {analysis && (
          <div className="space-y-2 rounded-lg border border-gray-200 bg-white p-4 text-sm leading-7 text-gray-700">
            {analysis.split("\n").map((line, index) => {
              const cleanLine = line
                .replace(/^#{1,6}\s*/, "")
                .replace(/\*\*/g, "");

              if (!cleanLine.trim()) return null;

              return <p key={index}>{cleanLine}</p>;
            })}
          </div>
        )}
      </div>
    </div>
  
  
  </CardContent>
</Card>
)}
      </div>

      {/* Chat Assistant */}

{chatOpen && (
  <div className="fixed bottom-24 right-6 z-50 flex w-[360px] max-w-[calc(100vw-48px)] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl">
    <div className="flex items-center justify-between border-b p-4">
      <h2 className="font-semibold">Chat assistant</h2>

      <button
        type="button"
        onClick={() => setChatOpen(false)}
        className="text-xl text-gray-500 hover:text-black"
      >
        ×
      </button>
    </div>

    <div className="h-[320px] overflow-y-auto p-4">
      <div className="rounded-xl bg-gray-100 p-3 text-sm">
        Hi! How can I help you with food today?
      </div>

     {chatHistory.map((message, index) => (
        <div
          key={index}
          className={`mt-3 flex ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          <div
            className={`max-w-[80%] whitespace-pre-line rounded-xl px-4 py-3 text-sm ${
              message.role === "user"
                ? "bg-black text-white"
                : "bg-gray-100 text-black"
            }`}
          >
            {message.text
              .replace(/#{1,6}\s?/g, "")
              .replace(/\*\*/g, "")
              .replace(/\*/g, "•")}
          </div>
        </div>
      ))} 

      {chatLoading && (
        <div className="mt-3 rounded-xl bg-gray-100 p-3 text-sm text-gray-500">
          Thinking...
        </div>
      )}

    <div ref={chatEndRef} />

    </div>

    <div className="flex gap-2 border-t p-4">
     <input
       type="text"
       placeholder="Ask something..."
       value={chatMessage}
       onChange={(e) => setChatMessage(e.target.value)}
       onKeyDown={(e) => {
        if (e.key === "Enter" && !chatLoading) {
          handleChat();
        }
      }}
       className="flex-1 rounded-lg border px-3 py-2 outline-none"
    />

    <button
      type="button"
      onClick={handleChat}
      disabled={!chatMessage.trim() || chatLoading}
      className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {chatLoading ? "..." : "↑"}
    </button>

    </div>
  </div>
)}

      {/* Chat Assistant Button */}
<button
  type="button"
  onClick={() => setChatOpen(true)}
  className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-black text-2xl text-white shadow-lg hover:bg-gray-800"
>
  💬
</button>

    </main>
  );
}


