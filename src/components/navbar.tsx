import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          E-Commerce.ai
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/products" className="text-gray-700 hover:text-black">
            Products
          </Link>
          <Link href="/admin" className="text-gray-700 hover:text-black">
            Admin
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
