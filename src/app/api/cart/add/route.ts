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
    const quantity = Math.max(1, Number(body?.quantity ?? 1));

    if (!Number.isFinite(productId)) {
      return NextResponse.json({ error: "productId is required" }, { status: 400 });
    }

    // Ensure cart exists
    const { data: cartRow, error: cartErr } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartErr) throw cartErr;

    let cartId = cartRow?.id as string | undefined;

    if (!cartId) {
      const { data: created, error: createErr } = await supabase
        .from("carts")
        .insert({ user_id: user.id })
        .select("id")
        .single();

      if (createErr) throw createErr;
      cartId = created.id;
    }

    // Upsert item (increment quantity if exists)
    const { data: existing, error: exErr } = await supabase
      .from("cart_items")
      .select("id, quantity")
      .eq("cart_id", cartId)
      .eq("product_id", productId)
      .maybeSingle();

    if (exErr) throw exErr;

    if (existing?.id) {
      const { error: upErr } = await supabase
        .from("cart_items")
        .update({ quantity: existing.quantity + quantity })
        .eq("id", existing.id);

      if (upErr) throw upErr;
    } else {
      const { error: insErr } = await supabase
        .from("cart_items")
        .insert({ cart_id: cartId, product_id: productId, quantity });

      if (insErr) throw insErr;
    }

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
