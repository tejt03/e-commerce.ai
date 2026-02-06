"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatLauncher() {
  const [open, setOpen] = useState(false);
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
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, open]);

  async function onSend() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: ChatMsg = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Next step: replace with real API call
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Next step will connect me to your product catalog and return real recommendations.",
        },
      ]);
      setLoading(false);
    }, 500);
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 shadow-lg hover:bg-sky-900"
        aria-label="Open shopping assistant"
      >
        {/* simple chat bubble icon */}
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-white"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3C6.486 3 2 6.94 2 11.789c0 2.548 1.283 4.85 3.35 6.436L4.5 21l3.405-1.705c1.237.35 2.608.54 4.095.54 5.514 0 10-3.94 10-8.789S17.514 3 12 3zm-4 10h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm0-4h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z" />
        </svg>
      </button>

      {/* Modal */}
      {open ? (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div className="absolute bottom-5 right-5 w-[92vw] max-w-105 overflow-hidden rounded-2xl border bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b px-4 py-5">
              <div>
                <p className="text-md font-semibold text-slate-900">
                  AI Shopping Assistant
                </p>
                <p className="text-[13px] text-slate-500">
                  Ask for recommendations from this store
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin"
                  className="hidden sm:inline rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
                >
                  Admin
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-red-500 px-3 py-2 text-xs font-semibold text-black hover:bg-red-600"
                >
                  Close
                </button>
              </div>
            </div>

            <div className="h-110 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                        m.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-slate-50 text-slate-800"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading ? (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      Thinking…
                    </div>
                  </div>
                ) : null}

                <div ref={bottomRef} />
              </div>
            </div>

            <div className="border-t p-3">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onSend();
                  }}
                  className="flex-1 rounded-xl border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Ask for recommendations…"
                />
                <button
                  onClick={onSend}
                  disabled={loading || !input.trim()}
                  className="rounded-xl bg-amber-400 px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
                >
                  Send
                </button>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">
                Next step: connect to Groq + Supabase and show real product cards.
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
