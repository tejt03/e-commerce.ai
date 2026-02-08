import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = supabaseServer(cookieStore);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: cart, error: cartErr } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartErr) throw cartErr;
    if (!cart?.id) return NextResponse.json({ items: [] });

    const { data: items, error: itemsErr } = await supabase
      .from("cart_items")
      .select("product_id, quantity, products:products(id,title,price,image_url,category)")
      .eq("cart_id", cart.id);

    if (itemsErr) throw itemsErr;

    return NextResponse.json({ items: items ?? [] });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
