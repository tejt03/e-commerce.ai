export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { supabaseServer } from "@/lib/supabase-server";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const supabase = supabaseServer(cookieStore);

  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return <AdminClient />;
}
