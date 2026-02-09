import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);

  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const productId = Number(body?.productId);
  const quantity = Number(body?.quantity);

  if (!Number.isFinite(productId) || !Number.isFinite(quantity)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Get user's cart
  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!cart?.id) return NextResponse.json({ error: "Cart not found" }, { status: 404 });

  // If quantity <= 0, remove item
  if (quantity <= 0) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("product_id", productId);

    return NextResponse.json({ ok: true });
  }

  // Update quantity
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("cart_id", cart.id)
    .eq("product_id", productId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
