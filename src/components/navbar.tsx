import Link from "next/link";
import UserMenu from "@/components/UserMenu";


export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/products" className="text-lg font-semibold tracking-tight text-blue-800 hover:text-indigo-800">
          E-Commerce AI Shopping Assistant
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link href="/products" className="rounded-full bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-700">
            Products
          </Link>
          <Link href="/admin" className="rounded-full bg-amber-300 px-4 py-2 font-semibold text-white-500 ring-1 ring-blue-200 hover:bg-amber-500">
            Admin
          </Link>
        </nav>


        <div className="flex items-center gap-3">
            <UserMenu />
          </div>
        </div>
    </header>
  );
}
