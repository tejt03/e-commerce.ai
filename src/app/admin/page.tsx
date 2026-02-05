import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase-server";
import AdminClient from "@/components/AdminClient";

export default async function AdminPage() {
  const supabase = await supabaseServer();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  return <AdminClient />;
}
