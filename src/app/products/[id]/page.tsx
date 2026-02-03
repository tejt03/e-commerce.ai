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

  const p = data as Product;

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          {p.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.image_url}
              alt={p.title}
              className="w-full rounded-lg object-cover"
            />
          ) : (
            <div className="h-64 w-full rounded-lg bg-gray-100" />
          )}
        </div>

        <div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          <p className="mt-2 text-sm text-gray-500">
            {p.category ?? "Uncategorized"}
          </p>

          <p className="mt-4 text-xl font-semibold">${p.price}</p>

          <div className="mt-4 text-sm text-gray-600 space-y-1">
            <p>
              <span className="font-medium">Brand:</span> {p.brand ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Rating:</span> {p.rating ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Stock:</span> {p.stock ?? "N/A"}
            </p>
          </div>

          <p className="mt-6 text-gray-700 whitespace-pre-wrap">
            {p.description ?? "No description available."}
          </p>
        </div>
      </div>
    </main>
  );
}
