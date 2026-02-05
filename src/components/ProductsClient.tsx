"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string | null;
  image_url: string | null;
};

export default function ProductsClient({
  products,
  categories,
}: {
  products: Product[];
  categories: string[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = category ? p.category === category : true;
      const matchesQuery = q
        ? (p.title ?? "").toLowerCase().includes(q)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [products, query, category]);

  return (
    <>
      {/* Filters */}
      <div className="mt-8 grid gap-3 rounded-2xl border bg-white/80 p-4 backdrop-blur sm:grid-cols-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
          placeholder="Search products…"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border px-4 py-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <button
          onClick={() => {
            setQuery("");
            setCategory("");
          }}
          className="rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300"
        >
          Clear filters
        </button>
      </div>

      {/* Count */}
      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-slate-600">
          Showing <span className="font-semibold text-slate-900">{filtered.length}</span>{" "}
          items
        </p>
      </div>

      {/* Grid */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((p) => (
          <Link
            key={p.id}
            href={`/products/${p.id}`}
            className="group rounded-xl border bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
              {p.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.image_url}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : null}

              <div className="absolute left-2 top-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                {p.category ?? "Uncategorized"}
              </div>
            </div>

            <div className="mt-3 space-y-2">
              <h3 className="line-clamp-2 text-sm font-medium text-slate-900">
                {p.title}
              </h3>

              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-blue-600">${p.price}</p>
                <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white transition group-hover:bg-blue-700">
                  View
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
