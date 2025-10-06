"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Settings2 } from "lucide-react";

interface ChatSettingsProps {
  model: string;
  setModel: (value: string) => void;
  systemPrompt: string;
  setSystemPrompt: (value: string) => void;
}

export function ChatSettings({
  model,
  setModel,
  systemPrompt,
  setSystemPrompt,
}: ChatSettingsProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full z-50 shadow-md"
          title="Chat settings"
        >
          Change Settings
          <Settings2 className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent side="top" className="mx-auto rounded-b-2xl max-w-2xl ">
        <SheetHeader>
          <SheetTitle>Chat Settings</SheetTitle>
          <SheetDescription>Customize your chat settings</SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 p-5">
          {/* Model Selector */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <Label htmlFor="model">Model</Label>
            <Select value={model} onValueChange={setModel}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gemini-2.5-flash">
                  Gemini 2.5 Flash ⚡
                </SelectItem>
                <SelectItem value="gemini-2.5-flash-lite">
                  Gemini 2.5 Flash Lite 💨
                </SelectItem>
                <SelectItem value="gemini-2.5-pro">
                  Gemini 2.5 Pro 🧠
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* System Prompt Input */}
          <div className="flex flex-col gap-2">
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Input
              id="system-prompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="text-sm"
              placeholder="Enter a custom system prompt..."
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
