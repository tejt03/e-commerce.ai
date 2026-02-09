import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = supabaseServer(cookieStore);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;
    if (!user) return NextResponse.json({ count: 0 });

    const { data: cart, error: cartErr } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (cartErr) throw cartErr;
    if (!cart?.id) return NextResponse.json({ count: 0 });

    const { data: rows, error: rowsErr } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("cart_id", cart.id);

    if (rowsErr) throw rowsErr;

    const count = (rows ?? []).reduce((sum: number, r: any) => sum + (r.quantity ?? 0), 0);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
