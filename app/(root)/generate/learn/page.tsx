"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { generateContent, type ResponseType } from "@/lib/ai-learn";
import Link from "next/link";
import {
  PlusCircle,
  BookOpen,
  ArrowRight,
  Sparkles,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<ResponseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [showNewForm, setShowNewForm] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedResponse = localStorage.getItem("response");
      if (storedResponse) {
        setResponse(JSON.parse(storedResponse));
      }
    }
  }, []);

  async function handleSubmit() {
    if (!prompt) return;
    setLoading(true);
    const response = await generateContent(prompt);
    localStorage.setItem("response", JSON.stringify(response));
    setResponse(response);
    setLoading(false);
    setShowNewForm(false);
  }

  function handleClearResponse() {
    localStorage.removeItem("response");
    setResponse(null);
    setPrompt("");
  }

  return (
    <div className="font-poppins min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto py-12 px-4 max-w-5xl">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-3 flex items-center justify-center gap-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span>Learn Anything</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Generate personalized learning paths for any topic you want to
            master
          </p>
        </header>

        <AnimatePresence mode="wait">
          {!response && !showNewForm ? (
            <motion.div
              key="initial-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="pb-2">
                  <h2 className="text-2xl font-semibold">
                    What do you want to learn?
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Enter a topic, skill, or subject you&apos;re interested in
                  </p>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="e.g., Machine Learning, French Cooking, Guitar..."
                        className="pr-10 py-6 text-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && prompt) {
                            handleSubmit();
                          }
                        }}
                      />
                      <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt || loading}
                    className="w-full py-6"
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating your learning path...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Generate Learning Path
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : response && !showNewForm ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex flex-wrap gap-3 justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">Your Learning Path</h2>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleClearResponse}
                    size="sm"
                  >
                    Clear Path
                  </Button>
                  <Button
                    onClick={() => setShowNewForm(true)}
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <PlusCircle className="h-4 w-4" />
                    New Topic
                  </Button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {response?.chapters?.map((chapter, index) => (
                  <Chapter
                    key={index}
                    {...chapter}
                    chapterNumber={index + 1}
                    totalChapters={response.chapters.length}
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="new-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-xl mx-auto"
            >
              <Card className="border-2 border-primary/10 shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">
                      New Learning Topic
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex flex-col gap-4">
                    <div className="relative">
                      <Input
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="What do you want to learn next?"
                        className="pr-10 py-6 text-lg"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && prompt) {
                            handleSubmit();
                          }
                        }}
                      />
                      <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSubmit}
                    disabled={!prompt || loading}
                    className="w-full py-6"
                    size="lg"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Generating your learning path...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        Generate Learning Path
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Chapter({
  chapterNumber,
  title,
  description,
  totalChapters,
}: {
  chapterNumber: number;
  title: string;
  description: string;
  totalChapters: number;
}) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-2 border-primary/5 hover:border-primary/20">
      <div className="relative">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold text-lg">
              {chapterNumber}
            </div>
            <h3 className="text-xl font-bold line-clamp-2">{title}</h3>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3">{description}</p>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-2">
          <div className="text-xs text-muted-foreground">
            Chapter {chapterNumber} of {totalChapters}
          </div>
          <Link href={`/generate/learn/${chapterNumber}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              Start Learning
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
}
