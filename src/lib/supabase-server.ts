import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabase = await supabaseServer();

export async function supabaseServer() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // In some Next.js cases (like Server Components), set may be blocked.
            // Middleware will handle session refresh.
          }
        },
      },
    }
  );
}
