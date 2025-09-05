import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="mx-auto flex min-h-screen max-w-6xl items-stretch p-3 sm:p-6">
        <div className="grid w-full grid-cols-1 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm lg:grid-cols-2">
          {/* Brand / Benefits panel (hidden on small screens) */}
          <aside className="relative hidden lg:flex lg:flex-col lg:justify-between bg-blue-600 text-white p-10">
            <header className="flex items-center gap-3">
              <div
                aria-hidden="true"
                className="h-8 w-8 rounded-md bg-white/15"
              />
              <span className="text-lg font-semibold tracking-tight">
                Create AI
              </span>
            </header>

            <div className="space-y-4">
              <h1 className="text-pretty text-3xl font-semibold leading-snug">
                Sign in or create your account
              </h1>
              <p className="max-w-sm text-white/80">
                Streamlined access with a focus on clarity, speed, and security.
              </p>
            </div>

            <footer className="mt-8 text-xs text-white/70">
              By continuing, you agree to our Terms and Privacy Policy.
            </footer>
          </aside>

          {/* Auth form container */}
          <div className="flex items-center justify-center ">
            {/* Card wrapper to frame forms consistently without dictating headings */}
            {children}
          </div>
        </div>
      </section>
    </main>
  );
}
