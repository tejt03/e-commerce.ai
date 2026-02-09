import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const ids = Array.isArray(body?.ids) ? body.ids : [];

    const cleanIds = ids
      .map((x: any) => Number(x))
      .filter((n: number) => Number.isFinite(n));

    if (!cleanIds.length) {
      return NextResponse.json({ products: [] });
    }

    const { data, error } = await supabase
      .from("products")
      .select("id, title, price, image_url, category")
      .in("id", cleanIds);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ products: data ?? [] });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
