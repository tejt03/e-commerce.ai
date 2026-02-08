export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

type CartRow = {
  product_id: number;
  quantity: number;
  products: {
    id: number;
    title: string;
    price: number;
    image_url: string | null;
    category: string | null;
  };
};

export default async function CheckoutPage() {
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) {
    return (
      <main className="min-h-screen px-4 py-10">
        <section className="mx-auto max-w-3xl rounded-2xl border bg-white/90 p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
          <p className="mt-2 text-sm text-slate-600">
            Please sign in to continue.
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

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  let items: CartRow[] = [];
  if (cart?.id) {
    const { data } = await supabase
      .from("cart_items")
      .select("product_id, quantity, products!inner(id,title,price,image_url,category)")
      .eq("cart_id", cart.id);

    items = (data ?? []) as unknown as CartRow[];
  }

  const totalQty = items.reduce((sum, row) => sum + (row.quantity ?? 0), 0);

  const subtotal: number = items.reduce((sum, row) => {
    const price = row.products?.price ?? 0;
    return sum + price * row.quantity;
  }, 0);

  const shipping: number = 0;
  const total: number = subtotal + shipping;

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-5xl px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Checkout</h1>
            <p className="mt-1 text-sm text-slate-600">
              Demo checkout page. No real payments are processed.
            </p>
          </div>
          <Link
            href="/cart"
            className="rounded-xl border bg-white/90 px-4 py-2 text-sm font-semibold text-black hover:bg-blue-500"
          >
            Back to cart
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* Payment (minimal placeholder) */}
          <div className="rounded-2xl border bg-white/90 p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Payment</h2>

            <div className="mt-4 rounded-xl border bg-slate-50 p-4 text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Card details</p>  

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <input
                  disabled
                  placeholder="Card number"
                  className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
                <input
                  disabled
                  placeholder="MM / YY"
                  className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
                <input
                  disabled
                  placeholder="CVC"
                  className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
                <input
                  disabled
                  placeholder="ZIP"
                  className="w-full rounded-xl border bg-white px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="mt-5 rounded-xl border bg-amber-50 p-4 text-xs text-amber-900">
              Demo mode: this button doesn’t charge money. It’s here to show a
              complete checkout flow.
            </div>

            <Link
                href="/checkout/success"
                className={`mt-5 block w-full rounded-xl px-4 py-3 text-center text-sm font-semibold ${
                    items.length === 0
                    ? "pointer-events-none bg-slate-200 text-slate-500"
                    : "bg-amber-400 text-black hover:bg-amber-500"
                }`}
                >
              Place order (demo)
            </Link>
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
                <span className="font-semibold">
                  {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-3">
                <span className="font-semibold text-slate-900">Total</span>
                <span className="text-lg font-bold text-blue-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="mt-5 rounded-xl border bg-white p-4">
              <p className="text-xs font-semibold text-slate-700">
                Items in cart
              </p>
              <p className="mt-1 text-sm text-slate-600">
                ({totalQty} item{totalQty === 1 ? "" : "s"})
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
