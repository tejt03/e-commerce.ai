import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = supabaseServer(cookieStore);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const productId = Number(body?.productId);
    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    const { data: cart, error: cartErr } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartErr) throw cartErr;
    if (!cart?.id) return NextResponse.json({ ok: true });

    const { error: delErr } = await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("product_id", productId);

    if (delErr) throw delErr;

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
