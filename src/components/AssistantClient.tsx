"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function AssistantClient() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! Tell me what you’re shopping for (budget, category, use-case). I’ll recommend products from this store.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  async function onSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Next step: we’ll replace this stub with a real API call to Groq + Supabase
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Got it. Next step will connect me to your product catalog and return real recommendations.",
        },
      ]);
      setLoading(false);
    }, 500);
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              AI Shopping Assistant
            </p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">
              Ask for product recommendations
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Natural language in, real products out. Powered by Groq + Supabase.
            </p>
          </div>

          <div className="flex gap-2">
            <Link
              href="/products"
              className="rounded-xl border bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/90 backdrop-blur"
            >
              Back to Store
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Chat */}
          <div className="rounded-2xl border bg-white/85 shadow-sm backdrop-blur">
            <div className="border-b px-5 py-4">
              <p className="text-sm font-semibold text-slate-900">Chat</p>
              <p className="text-xs text-slate-600">
                Try: “Best phone under $500 for photos” or “cheap skincare gifts”
              </p>
            </div>

            <div className="h-130 overflow-y-auto px-5 py-4">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                        m.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-white border text-slate-800"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
                {loading ? (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl border bg-white px-4 py-3 text-sm text-slate-600">
                      Thinking…
                    </div>
                  </div>
                ) : null}
                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t p-4">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSend();
                  }}
                  className="flex-1 rounded-xl border bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Ask for recommendations…"
                />
                <button
                  onClick={onSend}
                  disabled={loading || !input.trim()}
                  className="rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
                >
                  Send
                </button>
              </div>
            </div>
          </div>

          {/* Side panel */}
          <div className="rounded-2xl border bg-white/85 p-5 shadow-sm backdrop-blur">
            <p className="text-sm font-semibold text-slate-900">How it works</p>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• You describe what you want.</li>
              <li>• The assistant searches your Supabase product catalog.</li>
              <li>• Groq ranks options and explains why.</li>
              <li>• You get clickable product links.</li>
            </ul>

            <div className="mt-5 rounded-xl bg-blue-50 p-4 text-xs text-blue-900">
              Next: we’ll connect this to a real API + save chat messages to your
              <span className="font-semibold"> chat_messages</span> table.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
