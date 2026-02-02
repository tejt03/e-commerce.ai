import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { supabase } from "@/src/lib/supabase";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const productId = Number(body?.productId);

    if (Number.isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid productId" },
        { status: 400 }
      );
    }

    // 1) Load product from Supabase
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("id, title, category, brand, price, description")
      .eq("id", productId)
      .single();

    if (fetchError || !product) {
      return NextResponse.json(
        { error: "Product not found in DB" },
        { status: 404 }
      );
    }

    // 2) Ask Groq to generate a better description
    const prompt = `
Write a clean, persuasive e-commerce product description in 2 short paragraphs.
No buzzwords. No emojis. No bullet points.
Mention the product name, category, and brand if available.
Keep it under 90 words.

Product:
- Name: ${product.title}
- Category: ${product.category ?? "N/A"}
- Brand: ${product.brand ?? "N/A"}
- Price: ${product.price ?? "N/A"}
Current description (may be bad): ${product.description ?? "N/A"}
`;

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.6,
    });

    const newDescription =
      completion.choices?.[0]?.message?.content?.trim() ?? "";

    if (!newDescription) {
      return NextResponse.json(
        { error: "AI returned empty description" },
        { status: 500 }
      );
    }

    // 3) Save back to Supabase
    const { error: updateError } = await supabase
      .from("products")
      .update({ description: newDescription })
      .eq("id", productId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      productId,
      description: newDescription,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
