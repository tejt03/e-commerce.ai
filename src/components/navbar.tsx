"use client";

import Link from "next/link";
import UserMenu from "@/components/UserMenu";
import { useEffect, useState } from "react";

export default function Navbar() {


  const [cartCount, setCartCount] = useState(0);

  async function refreshCartCount() {
    try {
      const res = await fetch("/api/cart/count", { cache: "no-store" });
      if (!res.ok) {
        setCartCount(0);
        return;
      }
      const data = await res.json();
      setCartCount(Number(data?.count ?? 0));
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
  refreshCartCount();

  const handler = () => refreshCartCount();
  window.addEventListener("cart:updated", handler);

  return () => window.removeEventListener("cart:updated", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-lg font-semibold tracking-tight text-blue-800 hover:text-indigo-800">
          E-Commerce AI Shopping Assistant
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/products" className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Products
          </Link>
          <Link href="/admin" className="rounded-full bg-amber-300 px-4 py-2 font-semibold text-black hover:bg-amber-400">
            Admin
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 hover:bg-white border" 
          aria-label="Cart">
            {/* cart icon */}
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-slate-900" fill="currentColor">
              <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM6.2 6h14.9l-1.3 7.1c-.2 1-1 1.7-2 1.7H8.1c-1 0-1.8-.7-2-1.7L4.3 2H2V0h3.9l.3 2H22v2H6.6l-.4 2Z" />
            </svg>
          {/* badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
              {cartCount}
            </span>
          )}
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
