"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type ChatMsg = {
  id: string;
  role: "user" | "assistant";
  content: string;
  recommendations?: Recommendation[];
};

type Recommendation = { id: number; reason: string };

type ProductCard = {
  id: number;
  title: string;
  price: number;
  image_url: string | null;
  category: string | null;
};

type AssistantPayload = {
  assistant_message: string;
  recommendations: Recommendation[];
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

  const [productCache, setProductCache] = useState<
    Record<number, ProductCard>
  >({});

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

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = (await res.json()) as any;

      if (!res.ok) {
        const err = data?.error ?? "Request failed";
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: err,
          },
        ]);
        return;
      }

      const payload = data as AssistantPayload;

      // Cache products returned by /api/assistant so titles/images are available immediately
    const returnedProducts = Array.isArray(data.products) ? (data.products as ProductCard[]) : [];

    if (returnedProducts.length) {
        setProductCache((prev) => {
            const next = { ...prev };
            for (const p of returnedProducts) next[p.id] = p;
            return next;
        });
    }

      const assistantMsg: ChatMsg = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          payload.assistant_message ||
          "Here are some options you might like.",
        recommendations: payload.recommendations ?? [],
      };

      setMessages((prev) => [...prev, assistantMsg]);

      const ids = (payload.recommendations ?? []).map((r) => r.id);
      const missing = ids.filter((id) => !returnedProducts.some((p) => p.id === id) && !productCache[id]);


      if (missing.length) {
        const detailsRes = await fetch("/api/products/by-ids", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ids: missing }),
        });

        if (detailsRes.ok) {
          const details = (await detailsRes.json()) as {
            products: ProductCard[];
          };

          setProductCache((prev) => {
            const next = { ...prev };
            for (const p of details.products) next[p.id] = p;
            return next;
          });
        }
      }
    } catch (e: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: e?.message ?? "Something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-sky-600 shadow-lg hover:bg-sky-900"
        aria-label="Open shopping assistant"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 text-white"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3C6.486 3 2 6.94 2 11.789c0 2.548 1.283 4.85 3.35 6.436L4.5 21l3.405-1.705c1.237.35 2.608.54 4.095.54 5.514 0 10-3.94 10-8.789S17.514 3 12 3zm-4 10h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm0-4h8a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2z" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setOpen(false)}
          />

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
                aria-label="Close"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-black hover:bg-red-600"
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
                </button>
              </div>
            </div>

            <div className="h-110 overflow-y-auto px-4 py-4">
              <div className="space-y-3">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="max-w-[85%]">
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm leading-6 ${
                          m.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-50 text-slate-800"
                        }`}
                      >
                        {m.content}
                      </div>

                      {m.role === "assistant" &&
                        m.recommendations && m.recommendations?.length && (
                          <div className="mt-2 space-y-2">
                            {m.recommendations.slice(0, 5).map((rec) => {
                              const p = productCache[rec.id];
                              return (
                                <a
                                  key={rec.id}
                                  href={`/products/${rec.id}`}
                                  className="block rounded-xl border bg-white px-3 py-3 hover:bg-slate-50"
                                >
                                  <div className="flex gap-3">
                                    <div className="h-12 w-12 rounded-lg bg-linear-to-br from-blue-200 to-amber-200">
                                      {p?.image_url && (
                                        <img
                                          src={p.image_url}
                                          alt={p.title}
                                          className="h-full w-full object-cover"
                                        />
                                      )}
                                    </div>

                                    <div className="min-w-0 flex-1">
                                      <p className="truncate text-sm font-semibold text-slate-900">
                                        {p?.title ?? `Unknown Product`}{" "}
                                        <span className="text-xs font-medium text-slate-500">- #{rec.id}</span>
                                      </p>
                                      <p className="mt-0.5 text-xs text-slate-600">
                                        {rec.reason}
                                      </p>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-sm font-bold text-blue-600">
                                        {p?.price != null
                                          ? `$${p.price}`
                                          : ""}
                                      </p>
                                      <span className="mt-1 inline-block rounded-full bg-blue-600 px-3 py-1 text-xs font-semibold text-white">
                                        View
                                      </span>
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>
                        )}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="max-w-[85%] rounded-2xl bg-slate-50 px-3 py-2 text-sm text-slate-600">
                      Thinking…
                    </div>
                  </div>
                )}

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
            </div>
          </div>
        </div>
      )}
    </>
  );
}
