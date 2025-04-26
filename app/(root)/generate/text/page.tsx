"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Markdown } from "@/components/markdown";

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [prompt, setPrompt] = useState("");
  const examplePrompts = [
    "Write a poem about the ocean",
    "Explain quantum computing in simple terms",
    "Draft a friendly email to a coworker",
    "Generate a short story featuring a robot",
    "Summarize the latest news on AI",
  ];
  const [exampleIndex, setExampleIndex] = useState(0);

  // Rotate example prompts
  useEffect(() => {
    const interval = setInterval(() => {
      setExampleIndex((idx) => (idx + 1) % examplePrompts.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleResponse = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/generate/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const text = await res.text();
      setResponse(text);
    } catch (error) {
      setResponse("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleExampleClick = () => {
    setPrompt(examplePrompts[exampleIndex]);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 space-y-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-4xl font-bold text-center"
      >
        🤖 Ask AI
      </motion.h1>

      <div className="flex flex-col items-center gap-4 w-full max-w-md">
        <Input
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="text-base"
        />

        <Button
          onClick={handleResponse}
          disabled={loading || !prompt.trim()}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Thinking...
            </>
          ) : (
            "Submit"
          )}
        </Button>

        <Card className="w-full sm:w-[600px] min-h-[120px] max-h-[400px] overflow-x-auto">
          <CardContent className="px-4 text-sm break-words flex justify-center items-center">
            {loading ? (
              <div className="space-y-3 w-full">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : response ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-sm dark:prose-invert w-full"
              >
                <Markdown content={response} />
              </motion.div>
            ) : (
              <div className="flex justify-center items-center w-full">
                <motion.div
                  initial={{ y: 0, opacity: 0.7 }}
                  animate={{ y: [0, -10, 0], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="w-auto cursor-pointer"
                  onClick={handleExampleClick}
                >
                  <Card className="shadow-lg rounded-xl">
                    <CardContent className="text-sm italic text-muted-foreground px-4 py-2">
                      {examplePrompts[exampleIndex]}
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
