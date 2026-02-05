"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase()).join("");
}

export default function UserMenu() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [open, setOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      const { data } = await supabase.auth.getUser();
      const u = data.user;

      if (!mounted) return;

      setEmail(u?.email ?? "");
      setUserName((u?.user_metadata?.full_name as string) || (u?.user_metadata?.name as string) || "");
    }

    load();

    const { data: sub } = supabase.auth.onAuthStateChange(() => {
      load();
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const displayName = useMemo(() => {
    if (userName?.trim()) return userName.trim();
    if (email) return email.split("@")[0];
    return "";
  }, [userName, email]);

  async function logout() {
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/login");
    router.refresh();
  }

  if (!email) {
    return (
      <Link
        href="/login"
        className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-amber-300"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1.5 ring-1 ring-slate-200 hover:bg-white"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {initials(displayName || "U")}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-xs font-semibold text-slate-900 leading-4">
            {displayName}
          </p>
          <p className="text-[11px] text-slate-500 leading-4">Account</p>
        </div>
      </button>

      {open ? (
        <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border bg-white shadow-lg">
          <div className="px-4 py-3">
            <p className="text-xs font-semibold text-slate-900">
                {displayName || "Account"}
            </p>
            <p className="text-[11px] text-slate-500">
                Signed in
            </p>
          </div>

          <div className="border-t">
            <Link
              href="/admin"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Admin tools
            </Link>
            <Link
              href="/products"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
            >
              Storefront
            </Link>
            <button
              onClick={logout}
              className="block w-full px-4 py-2 text-left text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
