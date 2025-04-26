"use client";
import { ModeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export default function Layout({ children }: { children: ReactNode }) {
  const paths = [
    { name: "Home", path: "/", id: 1 },
    { name: "Text Gen", path: "/generate/text", id: 2 },
    { name: "Image Gen", path: "/generate/image", id: 3 },
  ];

  const asPath = usePathname();

  return (
    <div className="flex flex-col font-poppins">
      <nav className="px-4 py-2 bg-background text-foreground">
        <ul className="flex items-center space-x-4">
          {paths.map((path) => (
            <li key={path.id}>
              <Link
                href={path.path}
                className={twMerge(
                  asPath === path.path ? "underline" : "",
                  "hover:underline"
                )}
              >
                {path.name}
              </Link>
            </li>
          ))}
          <li className="ml-auto">
            <ModeToggle />
          </li>
        </ul>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
}
