export const dynamic = "force-dynamic";

import Link from "next/link";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export default async function CheckoutSuccessPage() {
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;

  if (!user) redirect("/login");

  // Find user's cart
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Clear cart items
  if (cart?.id) {
    await supabase.from("cart_items").delete().eq("cart_id", cart.id);
  }

  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="rounded-2xl border bg-white/90 p-8 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            ✅ Order placed
          </p>

          <h1 className="mt-4 text-2xl font-semibold text-slate-900">
            Your Order has been placed.
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            This is a demo checkout. Your cart has been cleared.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Back to products
            </Link>

            <Link
              href="/cart"
              className="rounded-xl border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View cart
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
