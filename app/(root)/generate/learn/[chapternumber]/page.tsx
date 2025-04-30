"use client";

import {
  type ChapterContentType,
  generateChapterContent,
  type ResponseType,
} from "@/lib/ai-learn";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";

interface ChapterType {
  title: string;
  description: string;
}

export default function Page() {
  const { chapternumber } = useParams();
  const [chapter, setChapter] = useState<ChapterType | null>(null);
  const [chapterContent, setChapterContent] =
    useState<ChapterContentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedResponse = localStorage.getItem("response");
    if (storedResponse) {
      const response: ResponseType = JSON.parse(storedResponse);
      const chapterData = response.chapters[Number(chapternumber) - 1];
      setChapter(chapterData);
      handleGenerateContent(chapterData, response.chapters);
    }
  }, [chapternumber]);

  async function handleGenerateContent(
    chapter: ChapterType,
    chapters: ChapterType[]
  ) {
    setIsLoading(true);
    try {
      const chapterContent = await generateChapterContent({
        selectedChapter: chapter,
        chapters,
      });
      setChapterContent(chapterContent);
    } catch (error) {
      console.error("Failed to generate content:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!chapter) {
    return (
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{chapter.title}</h1>
      <p className="text-muted-foreground mb-8">{chapter.description}</p>

      {isLoading ? (
        <LoadingSkeleton />
      ) : chapterContent ? (
        <ChapterContent chapterContent={chapterContent} />
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">
            Failed to generate content. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <Skeleton className="h-24 w-full mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-4/6" />
        </div>
      </div>

      <div>
        <Skeleton className="h-8 w-40 mb-4" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChapterContent({
  chapterContent,
}: {
  chapterContent: ChapterContentType;
}) {
  return (
    <div className="space-y-10">
      {/* Theory Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Theory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {chapterContent.Theory.description}
          </p>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Learning Resources</h3>
            <div className="grid gap-3">
              {chapterContent.Theory.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors w-full overflow-hidden"
                >
                  <ExternalLink className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm font-medium truncate block w-full break-all">
                    {res}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Assignments</h2>
        <Accordion type="single" collapsible className="w-full">
          {chapterContent.Assignments.map((assignment, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left">
                <span className="font-medium">
                  Q{idx + 1}: {assignment.question}
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-4 bg-muted/50 rounded-md">
                  <h4 className="text-sm font-semibold mb-2">Answer:</h4>
                  <p className="text-muted-foreground">{assignment.answer}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
