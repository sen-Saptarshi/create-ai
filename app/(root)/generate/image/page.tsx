"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Sparkles, Shuffle, ImageIcon, Loader2 } from "lucide-react";
import {
  getCameraAngleModifier,
  getLightingModifier,
  getRandomPrompt,
  getStyleModifier,
} from "@/lib/prompt-utils";
import { generateImage } from "@/lib/actions";
import Image from "next/image";
import { aiEnhancePrompt } from "@/lib/ai-enhance";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("");
  const [cameraAngle, setCameraAngle] = useState("");
  const [lighting, setLighting] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleEnhancePrompt = async () => {
    if (!prompt) return;

    setIsEnhancing(true);
    try {
      const enhanced = await aiEnhancePrompt(prompt);
      setPrompt(enhanced);
      toast("Prompt enhanced", {
        description: "Your prompt has been enhanced with AI",
      });
    } catch (e) {
      toast.error("Enhancement failed", {
        description: "Failed to enhance your prompt",
      });
      console.error(e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleRandomPrompt = () => {
    const randomPrompt = getRandomPrompt();
    setPrompt(randomPrompt);
    toast("Random prompt generated", {
      description: "A random prompt has been added",
    });
  };

  const handleGenerateImage = async () => {
    if (!prompt) {
      toast.error("Prompt required", {
        description: "Please enter a prompt to generate an image",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Build the final prompt with style, camera angle, and lighting
      let finalPrompt = prompt;

      if (style && style !== "none") {
        finalPrompt += getStyleModifier(style);
      }

      if (cameraAngle && cameraAngle !== "none") {
        finalPrompt += getCameraAngleModifier(cameraAngle);
      }

      if (lighting && lighting !== "none") {
        finalPrompt += getLightingModifier(lighting);
      }

      const imageData = await generateImage(finalPrompt);
      setImage(imageData);
      toast("Image generated", {
        description: "Your image has been successfully created",
      });
    } catch (error) {
      console.error("Failed to generate image:", error);
      toast.error("Generation failed", {
        description: "Failed to generate your image",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadImage = () => {
    if (!image) return;

    const link = document.createElement("a");
    link.href = image;
    link.download = `generated-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast("Image downloaded", {
      description: "Your image has been downloaded successfully",
    });
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-6 text-center dynamic-gradient">
          AI Image Generator
        </h1>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Create stunning AI-generated images by describing what you want to
          see. Customize style, camera angle, and lighting for perfect results.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <motion.div
          className="lg:col-span-5"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Image Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt" className="text-base font-medium">
                  Prompt
                </Label>
                <Textarea
                  id="prompt"
                  placeholder="Describe the image you want to generate..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="resize-none min-h-[120px]"
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEnhancePrompt}
                    disabled={!prompt || isEnhancing}
                  >
                    {isEnhancing ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Sparkles className="h-4 w-4 mr-2" />
                    )}
                    Enhance
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRandomPrompt}
                  >
                    <Shuffle className="h-4 w-4 mr-2" />
                    Random
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="style" className="text-base font-medium">
                    Style
                  </Label>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger id="style">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="anime">Anime</SelectItem>
                      <SelectItem value="realistic">Realistic</SelectItem>
                      <SelectItem value="3d">3D Render</SelectItem>
                      <SelectItem value="watercolor">Watercolor</SelectItem>
                      <SelectItem value="oil-painting">Oil Painting</SelectItem>
                      <SelectItem value="pixel-art">Pixel Art</SelectItem>
                      <SelectItem value="sketch">Sketch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="camera" className="text-base font-medium">
                    Camera Angle
                  </Label>
                  <Select value={cameraAngle} onValueChange={setCameraAngle}>
                    <SelectTrigger id="camera">
                      <SelectValue placeholder="Select camera angle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="close-up">Close-up</SelectItem>
                      <SelectItem value="wide-angle">Wide Angle</SelectItem>
                      <SelectItem value="aerial">Aerial View</SelectItem>
                      <SelectItem value="low-angle">Low Angle</SelectItem>
                      <SelectItem value="high-angle">High Angle</SelectItem>
                      <SelectItem value="dutch-angle">Dutch Angle</SelectItem>
                      <SelectItem value="fisheye">Fisheye</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lighting" className="text-base font-medium">
                    Lighting
                  </Label>
                  <Select value={lighting} onValueChange={setLighting}>
                    <SelectTrigger id="lighting">
                      <SelectValue placeholder="Select lighting" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="natural">Natural</SelectItem>
                      <SelectItem value="soft">Soft</SelectItem>
                      <SelectItem value="dramatic">Dramatic</SelectItem>
                      <SelectItem value="backlit">Backlit</SelectItem>
                      <SelectItem value="golden-hour">Golden Hour</SelectItem>
                      <SelectItem value="blue-hour">Blue Hour</SelectItem>
                      <SelectItem value="studio">Studio</SelectItem>
                      <SelectItem value="neon">Neon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                className="w-full mt-6 h-12 text-base"
                onClick={handleGenerateImage}
                disabled={!prompt || isGenerating}
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-5 w-5 mr-2" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="lg:col-span-7"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center p-6 min-h-[500px]">
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center w-full h-full"
                  >
                    <Skeleton className="w-full aspect-square max-w-[512px] rounded-md" />
                    <div className="mt-4 text-center">
                      <p className="text-muted-foreground animate-pulse">
                        Creating your masterpiece...
                      </p>
                    </div>
                  </motion.div>
                ) : image ? (
                  <motion.div
                    key="image"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="relative w-full flex flex-col items-center"
                  >
                    <div className="relative w-full max-w-[512px] aspect-square">
                      <Image
                        ref={imageRef}
                        src={image || "/placeholder.svg"}
                        alt="Generated image"
                        className="object-cover rounded-md shadow-lg"
                        fill
                        sizes="(max-width: 768px) 100vw, 512px"
                        priority
                      />
                    </div>
                    <Button
                      variant="default"
                      className="mt-6 px-6"
                      onClick={handleDownloadImage}
                      size="lg"
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download Image
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="placeholder"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-gray-300 rounded-lg w-full h-[512px]"
                  >
                    <ImageIcon className="h-20 w-20 text-muted-foreground/40 mb-4" />
                    <h3 className="text-xl font-medium">
                      No image generated yet
                    </h3>
                    <p className="text-sm text-muted-foreground mt-2 max-w-md">
                      Enter a prompt and click &quot;Generate Image&quot; to
                      create your masterpiece. Try adding style, camera angle,
                      and lighting options for better results.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
