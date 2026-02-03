export const dynamic = "force-dynamic";


import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    // 1) Fetch products from DummyJSON
    const res = await fetch("https://dummyjson.com/products?limit=30");
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch products from DummyJSON" },
        { status: 500 }
      );
    }

    const data = await res.json();
    const products = (data.products || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      category: p.category,
      description: p.description,
      image_url: p.thumbnail,
      brand: p.brand,
      rating: p.rating,
      stock: p.stock,
    }));

    // 2) Insert into Supabase (upsert avoids duplicates if you run it twice)
    const { error } = await supabase
      .from("products")
      .upsert(products, { onConflict: "id" });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      inserted: products.length,
      message: "Products seeded successfully",
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
