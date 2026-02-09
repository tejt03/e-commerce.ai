export default function LoadingProducts() {
  return (
    <main className="min-h-screen">
      <section className="relative overflow-hidden border-b">
        <div className="absolute inset-0 bg-linear-to-br from-sky-50 via-white to-rose-50" />
        <div className="relative mx-auto max-w-6xl px-4 py-12">
          <div className="h-6 w-44 rounded-full bg-white/80 border" />
          <div className="mt-4 h-10 w-80 rounded-lg bg-white/80 border" />
          <div className="mt-3 h-4 w-xl rounded bg-white/80 border" />

          <div className="mt-8 grid gap-3 rounded-2xl border bg-white/80 p-4 sm:grid-cols-3">
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
            <div className="h-12 rounded-xl bg-slate-100" />
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 15 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white/90 p-3 shadow-sm"
              >
                <div className="aspect-square rounded-xl bg-slate-100" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
                <div className="mt-3 flex items-center justify-between">
                  <div className="h-4 w-16 rounded bg-slate-100" />
                  <div className="h-6 w-14 rounded-full bg-slate-100" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
