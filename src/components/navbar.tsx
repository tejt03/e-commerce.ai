import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-lg font-semibold tracking-tight text-sky-700 hover:text-blue-800">
          E-Commerce AI
        </Link>

        <nav className="flex items-center gap-2 text-sm">
          <Link href="/products" className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Products
          </Link>
          <Link href="/admin" className="rounded-full bg-amber-300 px-4 py-2 font-semibold text-white-500 ring-1 ring-blue-200 hover:bg-amber-500">
            Admin
          </Link>
          <Link href="/login" className="rounded-full bg-white/80 px-4 py-2 font-semibold text-slate-700 ring-1 ring-slate-200 hover:bg-white">
            Login
          </Link>
        </nav>

        <div className="hidden md:block">
          <input
            className="w-64 rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            placeholder="Search products…"
          />
        </div>
      </div>
    </header>
  );
}
