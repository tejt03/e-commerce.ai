"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

export default function AddToCartButton({ productId }: { productId: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  async function addToCart() {
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 }),
      });

      // If not signed in → send to login, then come back here
      if (res.status === 401) {
        router.push(`/login?next=${encodeURIComponent(pathname)}`);
        return;
      }

      if (!res.ok) return;

      // update cart badge if you have an event-based refresh
      window.dispatchEvent(new Event("cart:updated"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={addToCart}
      disabled={loading}
      className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
    >
      {loading ? "Adding..." : "Add to cart"}
    </button>
  );
}
