import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string | null;
  image_url: string | null;
};

export default async function ProductsPage() {
  const { data, error } = await supabase
    .from("products")
    .select("id, title, price, category, image_url")
    .order("id", { ascending: true })
    .limit(60);

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <p className="text-sm text-red-600">Failed to load products.</p>
      </main>
    );
  }

  const products: Product[] = (data ?? []) as Product[];

  // Build a unique category list (server-side)
  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort() as string[];

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-linear-to-br from-indigo-50 via-white to-pink-50" />
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-pink-200/40 blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <p className="inline-flex items-center gap-2 rounded-full border bg-white/70 px-3 py-1 text-xs text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            Live catalog • AI-enriched descriptions
          </p>

          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Shop smarter with E-Commerce AI
          </h1>
          <p className="mt-3 max-w-1xl text-sm leading-6 text-gray-600">
            A modern storefront backed by Supabase and enhanced with AI-generated product descriptions. Built with Next.js + TypeScript + Tailwind.
          </p>

          {/* Filters (UI only for now; next step will make them functional) */}
          <div className="mt-8 grid gap-3 rounded-2xl border bg-white/80 p-4 backdrop-blur sm:grid-cols-3">
            <input
              className="w-full rounded-xl border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              placeholder="Search products…"
            />
            <select className="w-full rounded-xl border px-4 py-3 text-sm text-indigo-500 focus:outline-none focus:ring-2 focus:ring-black/10">
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button className="rounded-xl bg-indigo-500 px-4 py-3 text-sm font-medium text-white hover:bg-sky-700">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight">Products</h2>
          </div>
          <p className="text-xs text-gray-500">{products.length} items</p>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.id}`}
              className="group rounded-xl border bg-white/90 p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : null}

                <div className="absolute left-2 top-2 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-500">
                  {p.category ?? "Uncategorized"}
                </div>

              </div>

              <div className="mt-4 space-y-2">
                <h3 className="line-clamp-2 text-sm font-medium text-slate-900">
                  {p.title}
                </h3>

                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">${p.price}</p>
                  <span className="rounded-full bg-blue-500 px-3 py-1 text-xs font-medium text-white transition group-hover:bg-blue-700">
                    View
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
