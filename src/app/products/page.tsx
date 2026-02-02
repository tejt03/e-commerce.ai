import { supabase } from "@/src/lib/supabase";

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
    .order("id", { ascending: true });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-semibold">Products</h1>
        <p className="mt-4 text-red-500">Error: {error.message}</p>
      </main>
    );
  }

  const products = (data ?? []) as Product[];

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Products</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div
            key={p.id}
            className="rounded-lg border p-4 hover:shadow-sm transition"
          >
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image_url}
                alt={p.title}
                className="h-40 w-full object-cover rounded-md"
              />
            ) : (
              <div className="h-40 w-full rounded-md bg-gray-100" />
            )}

            <div className="mt-3">
              <a className="font-medium underline" href={`/products/${p.id}`}>
                {p.title}
              </a>
              <p className="text-sm text-gray-500">
                {p.category ?? "Uncategorized"}
              </p>
              <p className="mt-2 font-semibold">${p.price}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
