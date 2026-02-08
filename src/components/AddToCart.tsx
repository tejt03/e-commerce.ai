"use client";

import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function add() {
    if (loading) return;
    setLoading(true);
    setAdded(false);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error ?? "Add to cart failed");

      // Tell Navbar to refresh badge
      window.dispatchEvent(new Event("cart:updated"));
      setAdded(true);
    } catch (e) {
      // optional: you can show toast later
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={add}
      disabled={loading}
      className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
    >
      {loading ? "Adding..." : added ? "Added ✓" : "Add to cart"}
    </button>
  );
}
