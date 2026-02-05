import Link from "next/link";
import { supabase } from "@/lib/supabase";
import ProductsClient from "@/components/ProductsClient";


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

          <ProductsClient products={products} categories={categories} />

        </div>
      </section>
    </main>
  );
}
