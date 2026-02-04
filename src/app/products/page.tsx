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
  <main className="mx-auto max-w-6xl px-4 py-8">
    <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
    <p className="mt-1 text-sm text-gray-500">
      Browse our curated product selection
    </p>

    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => (
        <a
          key={p.id}
          href={`/products/${p.id}`}
          className="group rounded-xl border bg-white p-4 transition hover:shadow-md"
        >
          <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
            {p.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={p.image_url}
                alt={p.title}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
            ) : null}
          </div>

          <div className="mt-4 space-y-1">
            <h2 className="line-clamp-1 text-sm font-medium">
              {p.title}
            </h2>
            <p className="text-xs text-gray-500">
              {p.category ?? "Uncategorized"}
            </p>
            <p className="pt-1 text-sm font-semibold">
              ${p.price}
            </p>
          </div>
        </a>
      ))}
    </div>
  </main>
);
}