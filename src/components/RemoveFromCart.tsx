"use client";

import { useTransition } from "react";

export default function RemoveFromCartButton({ productId }: { productId: number }) {
  const [pending, startTransition] = useTransition();

  async function onRemove() {
    await fetch("/api/cart/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });

    // Refresh the server page so items/subtotal update
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <button
      type="button"
      onClick={onRemove}
      disabled={pending}
      className="rounded-xl border bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 hover:bg-red-500 disabled:opacity-60"
    >
      {pending ? "Removing..." : "Remove"}
    </button>
  );
}
