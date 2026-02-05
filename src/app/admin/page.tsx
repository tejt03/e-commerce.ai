"use client";

import { useState } from "react";

export default function AdminPage() {
  const [productId, setProductId] = useState("1");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  async function generateDescription() {
    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: Number(productId) }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error ?? "Request failed");
        return;
      }

      setResult(data.description);
    } catch (e: any) {
      setError(e?.message ?? "Unknown error");
    } finally {
      setLoading(false);
    }
  }

 return (
  <main className="min-h-screen">
    <section className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs font-medium text-blue-700 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Admin Console
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900">
            Product AI Tools
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Generate and persist improved product descriptions using Groq.
          </p>
        </div>

        <a
          href="/products"
          className="rounded-xl border bg-white/70 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-white/90 backdrop-blur"
        >
          Back to Store
        </a>
      </div>

      <div className="mt-8 rounded-2xl border bg-white/85 p-6 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">
              Generate AI Product Description
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Enter a product ID. The result is saved to Supabase and will show
              up on the product page.
            </p>
          </div>

          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Writes to DB
          </span>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto_auto] sm:items-end">
          <div>
            <label className="block text-xs font-medium text-slate-600">
              Product ID
            </label>
            <input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="mt-1 w-full rounded-xl border bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="e.g. 20"
            />
          </div>

          <button
            onClick={generateDescription}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate"}
          </button>

          <a
            href={`/products/${productId}`}
            className="rounded-xl bg-amber-400 px-5 py-2.5 text-center text-sm font-semibold text-slate-900 hover:bg-amber-300"
          >
            View Product
          </a>
        </div>

        {error ? (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {result ? (
          <div className="mt-5 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold text-slate-600">
                Generated Description
              </p>
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
                Saved
              </span>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-800">
              {result}
            </p>
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border bg-white/70 p-5 text-sm text-slate-600">
            Run generation to see output here.
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-slate-600">
        Tip: Use a product ID from <span className="font-semibold">/products</span>.
        This page is for internal demo purposes.
      </div>
    </section>
  </main>
);
}
