export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import RemoveFromCartButton from "@/components/RemoveFromCart";
import QuantityControl from "@/components/CartItemsQuantity";

type CartRow = {
  product_id: number;
  quantity: number;
  products: {
    id: number;
    title: string;
    price: number;
    image_url: string | null;
    category: string | null;
  }
};

export default async function CartPage() {
  // Load cart items via API route is possible too, but SSR is cleaner here:
    const cookieStore = await cookies();
    const supabase = supabaseServer(cookieStore);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;


    if (!user) {
        return (
        <main className="min-h-screen px-4 py-10">
            <section className="mx-auto max-w-4xl rounded-2xl border bg-white/90 p-6 shadow-sm">
            <h1 className="text-xl font-semibold text-slate-900">Your Cart</h1>
            <p className="mt-2 text-sm text-slate-600">
                Please sign in to view your cart.
            </p>
            <Link
                href="/login"
                className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
                Go to login
            </Link>
            </section>
        </main>
        );
    }

    const { data: cart, error: cartErr } = await supabase
        .from("carts")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

    if (cartErr) {
        return (
        <main className="min-h-screen px-4 py-10">
            <p className="text-red-600">Failed to load cart.</p>
        </main>
        );
    }

    let items: CartRow[] = [];
    if (cart?.id) {
        const { data, error } = await supabase
        .from("cart_items")
        .select("product_id, quantity, products!inner(id,title,price,image_url,category)")
        .eq("cart_id", cart.id);

        if (!error && data) items = data as unknown as CartRow[];
    }

    const subtotal = items.reduce((sum, row) => {
        const price = row.products?.price ?? 0;
        return sum + price * row.quantity;
    }, 0);

    // Similar products: based on categories of items in cart
    const cats = Array.from(
        new Set(items.map((i) => i.products?.category).filter(Boolean))
    ) as string[];

    let similar: any[] = [];
    if (cats.length) {
        const { data } = await supabase
        .from("products")
        .select("id,title,price,image_url,category")
        .in("category", cats)
        .limit(8);

        // remove items already in cart
        const inCart = new Set(items.map((i) => i.product_id));
        similar = (data ?? []).filter((p) => !inCart.has(p.id)).slice(0, 8);
    }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
            <p className="mt-1 text-sm text-slate-600">
              Review or remove items from cart, then continue to payment.
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-xl border bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
          >
            Continue shopping
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Cart Items */}
          <div className="rounded-2xl border bg-white/90 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Your items</h2>

            {items.length === 0 ? (
              <div className="mt-4 rounded-xl border bg-white p-5 text-sm text-slate-600">
                Your cart is empty.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {items.map((row) => {
                  const p = row.products;
                  if (!p) return null;

                  return (
                    <div
                      key={row.product_id}
                      className="flex gap-4 rounded-2xl border bg-white p-4"
                    >
                      <div className="h-20 w-20 overflow-hidden rounded-xl bg-gray-100">
                        {p.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={p.image_url}
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                        ) : null}
                      </div>

                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/products/${p.id}`}
                          className="line-clamp-1 text-sm font-semibold text-slate-900 hover:underline"
                        >
                          {p.title}
                        </Link>

                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                          <span className="rounded-full bg-blue-50 px-2 py-1 text-blue-700">
                            {p.category ?? "Uncategorized"}
                          </span>
                            <span>Qty:</span>
                            <QuantityControl productId={p.id} initialQty={row.quantity} />
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <p className="text-sm font-bold text-blue-600">
                            ${p.price}{" "}
                            <span className="text-xs font-medium text-slate-500">
                              × {row.quantity}
                            </span>
                          </p>

                          <div className="flex items-center justify-between">
                            <RemoveFromCartButton productId={p.id} />
                            </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="rounded-2xl border bg-white/90 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Order summary</h2>

            <div className="mt-4 space-y-2 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="font-semibold">Free</span>
              </div>
              <div className="border-t pt-3 flex items-center justify-between">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
            </div>

            <button
              disabled={items.length === 0}
              className="mt-5 w-full rounded-xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300 disabled:opacity-60"
            >
              Continue to payment
            </button>

          </div>
        </div>

        {/* Similar Products */}
        {similar.length > 0 ? (
          <div className="mt-10">
            <div className="flex items-end justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Similar products you may like
              </h2>
              <p className="text-xs text-slate-500">Based on items in your cart</p>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {similar.map((p) => (
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
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </main>
  );
}
