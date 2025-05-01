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
    prompt: `You will receive name of a Topic and you need to generate 5-10 chapters for this topic along with a one liner description.
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
    prompt: `
    You are given a list of chapters, and one chapter has been selected from this list. Your task is to generate both a **Theory** and an **Assignment** section for the selected chapter.

    ### 1. Theory Section
    - Write a clear, concise, and well-structured explanation of the selected chapter's topic.
    - Format the content using **Markdown** to create a visually organized and hierarchical structure (e.g. headings, subheadings, bullet points).
    - Do **not** include the chapter name or its short description—jump straight into the explanation.
    - At the end of the theory, include a list of **valuable learning resources**, which may include:
      - YouTube videos
      - Documentation links
      - Articles or blogs

    ### 2. Assignment Section
    - Create **3 to 8 questions** based on the topic.
    - Each question should include a **concise answer**.
    - At least **2-3 questions** should encourage the learner to do **additional self-research** while staying on topic. Indicate this explicitly in the question or its answer.

    ### Input
    - Selected chapter: ${JSON.stringify(selectedChapter)}
    - Full chapter list: ${JSON.stringify(chapters)}
        `,
  });

  return chapterContent;
}
