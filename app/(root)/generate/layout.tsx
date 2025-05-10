"use client";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Menu, X } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function Layout({ children }: { children: ReactNode }) {
  const paths = [
    { name: "Home", path: "/", id: 1 },
    { name: "Text Gen", path: "/generate/text", id: 2 },
    { name: "Image Gen", path: "/generate/image", id: 3 },
    { name: "Learn Anything", path: "/generate/learn", id: 4 },
  ];

  const asPath = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex flex-col font-poppins">
      <nav className="px-4 py-3 bg-background text-foreground border-b border-border">
        <div className="flex items-center justify-between">
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-muted transition"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          <ul className="hidden md:flex items-center space-x-4">
            {paths.map((path) => (
              <li key={path.id}>
                <Link
                  href={path.path}
                  className={twMerge(
                    asPath === path.path ? "underline" : "",
                    "hover:underline transition"
                  )}
                >
                  {path.name}
                </Link>
              </li>
            ))}
          </ul>

          <div className="ml-auto">
            <ModeToggle />
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <ul className="flex flex-col mt-4 space-y-3 md:hidden">
            {paths.map((path) => (
              <li key={path.id}>
                <Link
                  href={path.path}
                  className={twMerge(
                    asPath === path.path ? "underline" : "",
                    "hover:underline transition block px-2"
                  )}
                  onClick={() => setMenuOpen(false)}
                >
                  {path.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>

      <main className="flex-1">{children}</main>
      <Toaster />
    </div>
  );
}
