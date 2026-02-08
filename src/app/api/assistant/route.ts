import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";

type ProductLite = {
  id: number;
  title: string;
  price: number;
  category: string | null;
  rating: number | null;
  stock: number | null;
};


function extractKeywords(text: string) {
  const stop = new Set([
    "the","a","an","and","or","to","for","with","of","in","on","at","is","are",
    "best","good","cheap","under","over","between","show","me","i","want","need",
    "buy","looking","recommend","please","help","something","like"
  ]);

  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 3 && !stop.has(w));

  return Array.from(new Set(words)).slice(0, 8);
}

function extractBudgetMax(text: string): number | null {
  const t = text.toLowerCase();
  const m =
    t.match(/under\s*\$?\s*(\d{1,5})/) ||
    t.match(/below\s*\$?\s*(\d{1,5})/) ||
    t.match(/<=\s*\$?\s*(\d{1,5})/);

  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

const CATEGORY_SYNONYMS: Record<string, string[]> = {
  fragrances: [
    "fragrance",
    "fragrances",
    "perfume",
    "perfumes",
    "cologne",
    "colognes",
    "eau de parfum",
    "edp",
    "eau de toilette",
    "edt",
    "body spray",
    "spray",
    "deodorant",
    "deodorants",
    "scent",
    "scents",
    "aftershave",
    "after shave",
    "men's fragrance",
    "womens fragrance",
  ],

  beauty: [
    "beauty",
    "makeup",
    "make up",
    "cosmetics",
    "skincare",
    "skin care",
    "skin",
    "lotion",
    "lotions",
    "cream",
    "creams",
    "moisturizer",
    "moisturiser",
    "serum",
    "serums",
    "cleanser",
    "cleansers",
    "face wash",
    "facewash",
    "foundation",
    "concealer",
    "powder",
    "compact",
    "blush",
    "lipstick",
    "lip",
    "mascara",
    "eyeshadow",
    "eye shadow",
    "palette",
    "makeup palette",
    "nail polish",
    "nails",
    "perfume makeup", 
  ],

  groceries: [
    "grocery",
    "groceries",
    "food",
    "foods",
    "fresh",
    "produce",
    "vegetables",
    "veggies",
    "fruits",
    "fruit",
    "snack",
    "snacks",
    "drink",
    "drinks",
    "beverage",
    "beverages",
    "water",
    "soft drink",
    "soft drinks",
    "soda",
    "juice",
    "milk",
    "coffee",
    "nescafe",
    "tea",
    "protein",
    "protein powder",
    "meat",
    "meats",
    "chicken",
    "beef",
    "fish",
    "steak",
    "eggs",
    "dairy",
    "cooking",
    "cook",
    "oil",
    "cooking oil",
    "pantry",
    "kitchen staples",
    "ingredients",
  ],

  furniture: [
    "furniture",
    "sofa",
    "couch",
    "sectional",
    "bed",
    "beds",
    "bedframe",
    "bed frame",
    "mattress",
    "chair",
    "chairs",
    "stool",
    "table",
    "tables",
    "desk",
    "desks",
    "nightstand",
    "night stand",
    "side table",
    "end table",
    "dresser",
    "wardrobe",
    "cabinet",
    "shelf",
    "shelving",
  ],

  "home-decoration": [
    "home decor",
    "home décor",
    "decor",
    "decoration",
    "decorations",
    "decorate",
    "interior",
    "interior decor",
    "aesthetic",
    "wall decor",
    "wall art",
    "art",
    "frame",
    "photo frame",
    "picture frame",
    "family photo frame",
    "lamp",
    "table lamp",
    "lighting",
    "plant",
    "plants",
    "indoor plant",
    "house plant",
    "houseplant",
    "vase",
    "ornament",
    "showpiece",
    "show piece",
    "centerpiece",
    "swing",
    "decoration swing",
  ],

  "kitchen-accessories": [
    "kitchen",
    "kitchen accessory",
    "kitchen accessories",
    "kitchen tools",
    "kitchen tool",
    "utensil",
    "utensils",
    "cookware",
    "cooking tools",
    "kitchenware",
    "kitchen gadgets",
    "gadget",
    "gadgets",
    "spatula",
    "spoon",
    "fork",
    "knife",
    "cutlery",
    "chopping board",
    "cutting board",
    "board",
    "strainer",
    "sieve",
    "mesh strainer",
    "grater",
    "peeler",
    "juicer",
    "citrus squeezer",
    "rolling pin",
    "tray",
    "tongs",
    "turner",
    "spice rack",
    "microwave",
    "microwave oven",
    "oven",
    "electric stove",
    "stove",
    "blender",
    "hand blender",
    "mixer",
    "ice cube tray",
    "egg slicer",
    "mug stand",
    "mug tree",
    "lunch box",
    "storage box",
    "food container",
    "wok",
    "pan",
    "pot",
    "plate",
    "glass",
    "cup",
    "kitchen sink",
    "sink",
  ],

  laptops: [
    "laptop",
    "laptops",
    "notebook",
    "notebooks",
    "notebook pc",
    "computer",
    "computers",
    "pc",
    "windows laptop",
    "macbook",
    "macbook pro",
    "ultrabook",
    "work laptop",
    "school laptop",
    "college laptop",
    "programming laptop",
    "developer laptop",
    "gaming laptop",
    "business laptop",
  ],

  "mens-shirts": [
    "men shirts",
    "men's shirts",
    "mens shirts",
    "shirt",
    "shirts",
    "tshirt",
    "t-shirt",
    "t shirts",
    "tee",
    "tees",
    "polo",
    "polo shirt",
    "button down",
    "button-down",
    "button up",
    "button-up",
    "dress shirt",
    "formal shirt",
    "casual shirt",
    "plaid shirt",
    "check shirt",
    "checked shirt",
    "short sleeve shirt",
    "long sleeve shirt",
    "top",
    "tops",
  ],

  "mens-shoes": [
    "men shoes",
    "men's shoes",
    "mens shoes",
    "shoe",
    "shoes",
    "sneaker",
    "sneakers",
    "trainer",
    "trainers",
    "running shoes",
    "sports shoes",
    "athletic shoes",
    "casual shoes",
    "boots",
    "cleats",
    "football cleats",
    "soccer cleats",
    "gym shoes",
    "walking shoes",
  ],

  "mens-watches": [
    "men watches",
    "men's watches",
    "mens watches",
    "watch",
    "watches",
    "wristwatch",
    "wrist watch",
    "timepiece",
    "luxury watch",
    "automatic watch",
    "mechanical watch",
    "chronograph",
    "datejust", 
    "submariner",
    "rolex",
    "longines",
  ],

  "mobile-accessories": [
    "mobile accessories",
    "phone accessories",
    "mobile accessory",
    "phone accessory",
    "phone",
    "smartphone",
    "iphone accessories",
    "android accessories",
    "earbuds",
    "earphones",
    "headphones",
    "airpods",
    "wireless earbuds",
    "bluetooth earbuds",
    "speaker",
    "smart speaker",
    "echo",
    "amazon echo",
    "charger",
    "charging cable",
    "cable",
    "usb cable",
    "type c cable",
    "usb-c cable",
    "phone case",
    "case",
    "cover",
    "screen protector",
    "power bank",
    "portable charger",
    "adapter",
  ],
};


function resolveCategory(message: string, categories: string[]) {
  const t = message.toLowerCase();

  // 1) exact match on category string
  const direct = categories.find((c) => t.includes(c.toLowerCase()));
  if (direct) return direct;

  // 2) synonym match -> return canonical category if it exists in DB
  for (const [canonical, synonyms] of Object.entries(CATEGORY_SYNONYMS)) {
    if (synonyms.some((s) => t.includes(s))) {
      const match = categories.find(c => c.toLowerCase() === canonical.toLowerCase());
      return match ?? null;
    }
  }

  return null;
}


export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = supabaseServer(cookieStore);

    const { data: auth } = await supabase.auth.getUser();
    const user = auth.user;

    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to use the assistant." },
        { status: 401 }
      );
    }

    const body = await req.json().catch(() => null);
    const message = (body?.message ?? "").toString().trim();

    if (!message) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    // 1) Save user message
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "user",
      content: message,
    });

    // 2) Load a bit of chat history (last 12 messages)
    const { data: historyRows } = await supabase
      .from("chat_messages")
      .select("role, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(12);

    const history = (historyRows ?? [])
      .reverse()
      .map((m) => ({ role: m.role, content: m.content }));

    const { data: catRows } = await supabase
    .from("products")
    .select("category")
    .not("category", "is", null);

    const categories = Array.from(
      new Set((catRows ?? []).map((r: any) => r.category).filter(Boolean))
    ) as string[];

    // 3) Pull relevant products (cheap heuristic)
    const keywords = extractKeywords(message);
    const budgetMax = extractBudgetMax(message);
    const catHint = resolveCategory(message,categories);

    let q = supabase
      .from("products")
      .select("id, title, price, category, rating, stock")
      .limit(60);

    if (catHint) q = q.eq("category", catHint);
    if (budgetMax != null) q = q.lte("price", budgetMax);

    if (keywords.length && !catHint) { 
      const or = keywords
      .map((k) => `title.ilike.%${k}%,category.ilike.%${k}%`)
      .join(",");
      q = q.or(or);
    }
    
    if (keywords.length && catHint) {
      for (const k of keywords) {
        q = q.ilike("title", `%${k}%`);
      }
    }

    let { data: productsData } = await q;
    let products = (productsData ?? []) as ProductLite[];

    // Fallback: if too few results, widen search
    // STRICT fallback sequence:
    // 1) category+budget+keywords (already done above)
    // 2) if too few, retry category+budget only (no keywords)
    // 3) if still none, return "not found" (no Groq call)

    if (products.length < 8) {
      let q2 = supabase
        .from("products")
        .select("id, title, price, category, rating, stock")
        .limit(60);

      if (catHint) q2 = q2.eq("category", catHint);
      if (budgetMax != null) q2 = q2.lte("price", budgetMax);

      const { data: d2 } = await q2;
      products = (d2 ?? []) as ProductLite[];
    }

    // Hard stop if still nothing after strict fallback
    if (products.length === 0) {
      const msg =
      catHint && budgetMax != null
        ? `I couldn't find any ${catHint} products under $${budgetMax}.`
        : catHint
        ? `I couldn't find any products in the "${catHint}" category.`
        : budgetMax != null
        ? `I couldn't find any products under $${budgetMax}.`
        : `I couldn't find any products that match your request.`;

      await supabase.from("chat_messages").insert({
        user_id: user.id,
        role: "assistant",
        content: msg,
      });

      return NextResponse.json({
        assistant_message: msg,
        recommendations: [],
        products: [],
      });
    }

    // 4) Call Groq (OpenAI-compatible)
const system = `
You are an AI shopping assistant for an e-commerce site.
You must recommend ONLY from the provided product list.
Ignore earlier requests unless the latest message explicitly references them.
Choose products ONLY if they strictly match the user's latest request.
Do NOT suggest related or alternative categories unless explicitly requested.
If a budget is mentioned by the user, do NOT recommend items above the budget.

Hard rules:
- If the user specifies a category/type (e.g. "makeup", "fragrance", "laptop"), recommend ONLY products that match that category/type.
- If the user specifies a max price (e.g. under $50), recommend ONLY products with price <= that max.
- If no matching products exist, return an assistant_message explaining that nothing matches and include an empty recommendations array.
- Recommend 3 to 6 items.
- Reasons must mention why it matches the user's need (budget, category, use-case).
- Use only IDs from the provided list.
- Do not include any extra keys or any text outside JSON.

Return STRICT JSON with this shape:
{
  "assistant_message": "string",
  "recommendations": [
    { "id": number, "reason": "short reason referencing the request" }
  ]
}
`.trim();

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        temperature: 0.5,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: system },
          {
            role: "user",
            content: JSON.stringify({
              user_message: message,
              inferred_category: catHint,
              budget_max: budgetMax,
              products,
            }),
          },
        ],
      }),
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      return NextResponse.json(
        { error: "Groq request failed.", details: errText.slice(0, 400) },
        { status: 500 }
      );
    }

    const groqJson = await groqRes.json();
    const content = groqJson?.choices?.[0]?.message?.content ?? "{}";

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch {
      return NextResponse.json(
        { error: "Assistant returned invalid JSON.", raw: content.slice(0, 400) },
        { status: 500 }
      );
    }

    const assistantMessage = (parsed?.assistant_message ?? "").toString();
    let recommendations = Array.isArray(parsed?.recommendations)
    ? parsed.recommendations.slice(0, 6)
    : [];

    //clean/validate recommendations immediately after parsing
    const allowedIds = new Set(products.map((p) => p.id));

    recommendations = recommendations
    .map((r: any) => ({
      id: Number(r?.id),
      reason: String(r?.reason ?? "").trim(),
    }))
    .filter((r: any) => Number.isFinite(r.id) && allowedIds.has(r.id))
    .filter((r: any) => r.reason.length >= 12);


    // 5) Save assistant message
    await supabase.from("chat_messages").insert({
      user_id: user.id,
      role: "assistant",
      content: assistantMessage || "Here are some options you might like.",
    });

    const recIds = (recommendations ?? []).map((r: any) => Number(r.id)).filter(Number.isFinite);

    let recProducts: any[] = [];
    if (recIds.length) {
      const { data } = await supabase
        .from("products")
        .select("id, title, price, image_url, category")
        .in("id", recIds);
      recProducts = data ?? [];
    }

    return NextResponse.json({
      assistant_message: assistantMessage,
      recommendations,
      products: recProducts,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
