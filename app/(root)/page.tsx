import { Button } from "@/components/ui/button";
import Link from "next/link";

// app/page.tsx
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-gradient-to-br from-blue-50 to-purple-100 font-poppins">
      {/* Hero Section */}
      <section className="text-center mt-24">
        <h1 className="text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
          Unlock the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
            Power of AI
          </span>
        </h1>
        <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
          Chat naturally. Generate stunning images.{" "}
          <br className="hidden md:inline" /> All in one powerful platform.
        </p>
        <Link href={"/generate/text"}>
          <Button className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition shadow-lg">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="mt-32 grid md:grid-cols-2 gap-12 w-full max-w-6xl">
        <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300">
          <h2 className="text-3xl font-bold mb-4 text-blue-700">
            <Link href={"/generate/text"}>AI Chat Assistant</Link>
          </h2>
          <p className="text-gray-600 text-lg">
            Engage in human-like conversations with our state-of-the-art AI chat
            system, designed for natural interactions.
          </p>
        </div>
        <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition duration-300">
          <h2 className="text-3xl font-bold mb-4 text-purple-700">
            <Link href={"/generate/image"}>AI Image Generation</Link>
          </h2>
          <p className="text-gray-600 text-lg">
            Transform your imagination into breathtaking visuals with
            cutting-edge image generation technology.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="mt-32 text-center">
        <h3 className="text-4xl text-gray-900 font-extrabold mb-6">
          Ready to{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-500">
            Experience the Future?
          </span>
        </h3>
        <Button className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-lg rounded-2xl hover:from-green-600 hover:to-emerald-600 transition shadow-lg">
          Try it Free
        </Button>
      </section>

      {/* Footer */}
      <footer className="mt-32 text-gray-500 text-sm text-center">
        &copy; {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-700">Saptarshi</span>. All
        rights reserved.
      </footer>
    </main>
  );
}
