"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  async function onSubmit(e: React.FormEvent) {
  e.preventDefault();
  setError("");
  setSuccess(""); // add: const [success, setSuccess] = useState("")
  setLoading(true);

  try {
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
        },
      });

      if (error) {
        const msg = (error.message || "").toLowerCase();

        if (
          msg.includes("already") ||
          msg.includes("registered") ||
          msg.includes("exists")
        ) {
          throw new Error(
            "An account with this email already exists. Please sign in instead."
          );
        }

        throw error;
      }

      // Success UX: show message, switch to sign-in, then redirect to /login
      setSuccess("Account created. Please sign in.");
      setMode("signin");
      setPassword("");

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 800);

      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    router.push("/admin");
    router.refresh();
  } catch (err: any) {
    setError(err?.message ?? "Something went wrong");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-md px-4 py-12">
        <div className="rounded-2xl border bg-white/90 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-slate-900">
              {mode === "signin" ? "Sign in" : "Create account"}
            </h1>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
              Supabase Auth
            </span>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {mode === "signin"
              ? "Sign in to access AI tools."
              : "Create an account to try the AI description generator."}
          </p>

          <div className="mt-5 grid grid-cols-2 rounded-xl border bg-white/70 p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                mode === "signin"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                mode === "signup"
                  ? "bg-blue-600 text-white"
                  : "text-slate-700 hover:bg-white"
              }`}
            >
              Sign up
            </button>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            {mode === "signup" ? (
              <div>
                <label className="block text-xs font-medium text-slate-600">
                  Full name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Your name"
                />
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-medium text-slate-600">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={6}
                className="mt-1 w-full rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-500">
                Minimum 6 characters.
              </p>
            </div>

            {success ? (
                <div className="rounded-xl border border-green-500 bg-green-300 p-3 text-sm text-green-900">
                    {success}
                </div>
            ) : null}


            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <button
              disabled={loading}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>

        </div>
      </section>
    </main>
  );
}
