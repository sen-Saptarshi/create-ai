"use server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import z from "zod";

const responseSchema = z.object({
  chapters: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
    })
  ),
});

export type ResponseType = z.infer<typeof responseSchema>;

export async function generateContent(prompt: string) {
  const model = google("gemini-1.5-flash-002");
  const { object: response } = await generateObject({
    model,
    schema: responseSchema,
    prompt: `You will receive name of a Topic and you need to generate 5-7 chapters for this topic.
    Topic name is found in the following prompt.
    Also don't include chapter number in chapter titles.
    Prompt :-  ${prompt}`,
  });

  return response;
}

const chapterContentSchema = z.object({
  Theory: z.object({
    description: z.string(),
    resources: z.array(z.string()),
  }),

  Assignments: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
    })
  ),
});

export type ChapterContentType = z.infer<typeof chapterContentSchema>;

interface generateChapterContentProps {
  selectedChapter: { title: string; description: string };
  chapters: { title: string; description: string }[];
}

export async function generateChapterContent({
  selectedChapter,
  chapters,
}: generateChapterContentProps) {
  const model = google("gemini-1.5-flash-002");
  const { object: chapterContent } = await generateObject({
    model,
    schema: chapterContentSchema,
    prompt: `You have some chapters details.
        You need to generate a theory part and an assignments part for the selected chapter.
        The theory part contains basic description and a list of important resources or links.
        And the assignment part contains 3-8 questions along with answer.
        Some questions from the assignment part should require additional self researching.
        
        The selected chapter is - ${JSON.stringify(selectedChapter)}

        This is selected from this list of chapters - ${JSON.stringify(
          chapters
        )}
        `,
  });

  return chapterContent;
}
