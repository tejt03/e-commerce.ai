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

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Image */}
        <div className="rounded-2xl border bg-white p-6">
          <div className="aspect-square overflow-hidden rounded-xl bg-gray-100">
            {product.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.image_url}
                alt={product.title}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-gray-500">{product.category}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <p className="text-2xl font-semibold">${product.price}</p>
            {product.brand ? (
              <span className="rounded-full border px-3 py-1 text-xs text-gray-600">
                Brand: {product.brand}
              </span>
            ) : null}
          </div>

          <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-sm font-medium text-gray-700">Description</h2>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {product.description || "No description available."}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-black px-5 py-3 text-sm font-medium text-white hover:bg-black/90">
              Add to cart
            </button>
          </div>

          <div className="text-xs text-gray-500">
            Rating: {product.rating ?? "N/A"} • Stock: {product.stock ?? "N/A"}
          </div>
        </div>
      </div>
    </main>
  );
}
