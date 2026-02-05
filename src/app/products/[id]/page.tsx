export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string | null;
  description: string | null;
  image_url: string | null;
  brand: string | null;
  rating: number | null;
  stock: number | null;
};

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // <-- key fix
  const productId = Number(id);

  if (Number.isNaN(productId)) {
    return (
      <main className="p-8">
        <p>Invalid product id: {String(id)}</p>
      </main>
    );
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id, title, price, category, description, image_url, brand, rating, stock"
    )
    .eq("id", productId)
    .single();

  if (error || !data) {
    return (
      <main className="p-8">
        <p>Product not found.</p>
      </main>
    );
  }

  const product = data as Product;

  //products recommendation section
  const { data: relatedData } = await supabase
  .from("products")
  .select("id, title, price, category, image_url")
  .eq("category", product.category)
  .neq("id", product.id)
  .limit(8);

  const related = (relatedData ?? []) as Array<{
  id: number;
  title: string;
  price: number;
  category: string | null;
  image_url: string | null;
  }>;


 return (
  <main className="min-h-screen">
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : null}

            <div className="absolute left-3 top-3 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
              {product.category}
            </div>
          </div>
        </div>

        {/* Buy box */}
        <div className="space-y-5">
          <h1 className="text-2xl font-semibold text-slate-900">
            {product.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price}
            </span>

            {product.rating ? (
              <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800">
                ⭐ {product.rating} / 5
              </span>
            ) : null}

            {product.stock ? (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
                In stock
              </span>
            ) : (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Out of stock
              </span>
            )}
          </div>

          <div className="rounded-2xl border bg-white/90 p-5 shadow-sm">
            <p className="text-sm leading-6 text-slate-700">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">
              Add to cart
            </button>

            <button className="flex-1 rounded-xl bg-amber-400 px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300">
              Buy now
            </button>
          </div>

          <div className="rounded-xl border bg-white/80 p-4 text-xs text-slate-600">
            <p>
              Free delivery available • Secure checkout • Easy returns
            </p>
          </div>
        </div>

        {related.length ? (
          
  <div className="mt-10">
    <div className="flex items-end justify-between">
      <h2 className="text-lg font-semibold text-slate-900">
        Recommended for you
      </h2>
      <p className="text-xs text-slate-500">
        Based on category: {product.category}
      </p>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {related.map((p) => (
        <a
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
            <p className="line-clamp-2 text-sm font-medium text-slate-900">
              {p.title}
            </p>
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-blue-600">${p.price}</p>
              <span className="rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white transition group-hover:bg-blue-700">
                View
              </span>
            </div>
          </div>
        </a>
      ))}
    </div>
  </div>
) : null}

      </div>
    </section>
  </main>
);

}
