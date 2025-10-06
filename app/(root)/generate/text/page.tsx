"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Markdown } from "@/components/markdown";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Paperclip, SendIcon, X, FileText, SparkleIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChatSettings } from "@/components/ChatSettings";

async function convertFilesToDataURLs(
  files: FileList
): Promise<
  { type: "file"; filename: string; mediaType: string; url: string }[]
> {
  return Promise.all(
    Array.from(files).map(
      (file) =>
        new Promise<{
          type: "file";
          filename: string;
          mediaType: string;
          url: string;
        }>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () =>
            resolve({
              type: "file",
              filename: file.name,
              mediaType: file.type,
              url: reader.result as string,
            });
          reader.onerror = reject;
          reader.readAsDataURL(file);
        })
    )
  );
}

export default function Chat() {
  const [model, setModel] = useState("gemini-2.5-flash-lite");
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant. " +
      "Answer questions concisely, clearly, and with a touch of creativity. " +
      "Use markdown for formatting and include relevant emojis to enhance communication."
  );
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<FileList | undefined>();
  const [previews, setPreviews] = useState<
    { filename: string; mediaType: string; url: string }[]
  >([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() && (!files || files.length === 0)) return;

    const fileParts =
      files && files.length > 0 ? await convertFilesToDataURLs(files) : [];

    sendMessage({
      role: "user",
      parts: [{ type: "text", text: input }, ...fileParts],
      metadata: { model, system: systemPrompt },
    });

    setInput("");
    setFiles(undefined);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files;
    if (!selected) return;
    setFiles(selected);
    const urls = await convertFilesToDataURLs(selected);
    setPreviews(urls);
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto h-[calc(100vh-7rem)] overflow-y-auto bg-background">
      {/* Empty Screen */}
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center h-full gap-6 p-6">
          <h1 className="text-3xl font-bold">
            AI Chat <SparkleIcon className="inline-block size-5" />{" "}
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm">
            Start chatting with your AI assistant. You can send text messages
            and attach files for context.
          </p>

          <ChatSettings
            model={model}
            setModel={setModel}
            systemPrompt={systemPrompt}
            setSystemPrompt={setSystemPrompt}
          />
        </div>
      ) : (
        <>
          {/* Message list */}
          <div className="flex flex-col gap-4 px-4 py-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex w-full",
                  message.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl px-4 py-2 text-sm leading-relaxed",
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm border-transparent max-w-[85%]"
                      : "text-foreground"
                  )}
                >
                  {message.parts.map((part, i) => {
                    if (part.type === "text") {
                      return message.role === "user" ? (
                        <pre className="font-poppins" key={`${message.id}-${i}`}>
                          {part.text}
                        </pre>
                      ) : (
                        <Markdown
                          key={`${message.id}-${i}`}
                          content={part.text}
                          className="prose prose-sm dark:prose-invert"
                        />
                      );
                    }

                    if (part.type === "file") {
                      // If it's an image, show the image inside the bubble
                      if (part.mediaType.startsWith("image/")) {
                        return (
                          <div key={`${message.id}-img-${i}`} className="mt-2">
                            <img
                              src={part.url}
                              alt={part.filename}
                              onError={(e) =>
                                ((e.target as HTMLImageElement).style.display =
                                  "none")
                              }
                              className="rounded-lg max-w-[250px] border shadow-md"
                            />
                          </div>
                        );
                      }

                      // For PDF or other files — show an icon instead of filename text
                      return (
                        <div
                          key={`${message.id}-fileicon-${i}`}
                          className="mt-2 flex items-center justify-center w-20 h-20 bg-muted rounded-lg"
                        >
                          <a
                            href={part.url}
                            download={part.filename}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FileText className="w-8 h-8 text-muted-foreground" />
                          </a>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>
            ))}
            <div ref={endRef} />
          </div>
        </>
      )}

      {/* Floating file preview */}
      {previews.length > 0 && (
        <div className="fixed bottom-28 left-0 right-0 flex justify-center">
          <div className="flex gap-2 max-w-2xl px-4 flex-wrap">
            {previews.map((file, idx) => (
              <div
                title={file.filename}
                key={idx}
                className="relative border rounded-lg overflow-hidden w-16 h-16 bg-muted flex items-center justify-center"
              >
                {file.mediaType.startsWith("image/") ? (
                  <img
                    src={file.url}
                    alt={file.filename}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <FileText className="w-6 h-6 text-muted-foreground" />
                )}
                <button
                  onClick={() =>
                    setPreviews(previews.filter((_, i) => i !== idx))
                  }
                  className="absolute top-1 right-1 bg-black/60 rounded-full p-[3px] self-center cursor-pointer"
                >
                  <X size={10} color="white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <form
        onSubmit={handleSend}
        className="fixed bottom-0 left-0 right-0 flex justify-center bg-gradient-to-t from-background to-transparent py-4"
      >
        <div className="flex items-end gap-2 w-full max-w-2xl bg-background dark:bg-zinc-900 border border-border rounded-xl px-3 py-2 shadow-md">
          <label className="cursor-pointer p-2 rounded-md hover:bg-muted transition">
            <Paperclip className="w-5 h-5" />
            <input
              type="file"
              accept="*"
              multiple
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
          </label>

          {/* Textarea instead of input */}
          <Textarea
            className="flex-1 border-0 bg-transparent focus-visible:ring-0 resize-none text-sm max-h-32"
            value={input}
            placeholder="Send a message..."
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend(e);
              }
            }}
            onChange={(e) => setInput(e.currentTarget.value)}
          />

          <Button size="icon" type="submit" className="shrink-0">
            <SendIcon className="w-5 h-5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
