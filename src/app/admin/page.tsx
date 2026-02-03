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
    <main className="p-8 max-w-2xl">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>

      <div className="mt-6 space-y-3">
        <label className="block text-sm font-medium">Product ID</label>
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
        />

        <button
          onClick={generateDescription}
          disabled={loading}
          className="rounded-md border px-4 py-2"
        >
          {loading ? "Generating..." : "Generate AI Description"}
        </button>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {result && (
          <div className="rounded-md border p-4">
            <p className="text-sm whitespace-pre-wrap">{result}</p>
          </div>
        )}
      </div>
    </main>
  );
}
