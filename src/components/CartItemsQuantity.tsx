"use client";

import { useState, useTransition } from "react";

export default function QuantityControl({
  productId,
  initialQty,
}: {
  productId: number;
  initialQty: number;
}) {
  const [qty, setQty] = useState(initialQty);
  const [pending, startTransition] = useTransition();

  async function setQuantity(nextQty: number) {
    setQty(nextQty);

    await fetch("/api/cart/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: nextQty }),
    });

    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border bg-white px-1 py-1">
      <button
        type="button"
        onClick={() => setQuantity(qty - 1)}
        disabled={pending}
        className="h-7 w-7 rounded-lg border text-sm font-semibold hover:bg-blue-300 disabled:opacity-50"
      >
        -
      </button>

      <span className="min-w-6 text-center text-sm font-semibold text-slate-800">
        {qty}
      </span>

      <button
        type="button"
        onClick={() => setQuantity(qty + 1)}
        disabled={pending}
        className="h-7 w-7 rounded-lg border text-sm font-bold hover:bg-blue-300 disabled:opacity-50"
      >
        +
      </button>
    </div>
  );
}
