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
  <main className="mx-auto max-w-3xl px-4 py-10">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-gray-500">
          Internal tool for enriching product descriptions.
        </p>
      </div>
      <span className="rounded-full border px-3 py-1 text-xs text-gray-600">
        AI Tools
      </span>
    </div>

    <div className="mt-8 rounded-2xl border bg-white p-6">
      <h2 className="text-sm font-medium text-gray-700">
        Generate your Product's Description here
      </h2>
      <p className="mt-1 text-sm text-gray-500">
        Enter the product's ID to generate a concise, high quality description and save it to the database.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600">
            Product ID
          </label>
          <input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="e.g. 20"
          />
        </div>

        <button
          onClick={generateDescription}
          disabled={loading}
          className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-black/90 disabled:opacity-60"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {error ? (
        <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 rounded-xl border bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">
              The new AI Generated Description:
            </p>
          </div>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-800">
            {result}
          </p>
        </div>
      ) : null}
    </div>

    <div className="mt-6 text-xs text-gray-500">
      Tip: After generating, open <span className="font-medium">/products/{productId}</span>{" "}
      to confirm the updated description is visible to users.
    </div>
  </main>
);
}
