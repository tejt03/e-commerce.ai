export default function LoadingProductDetail() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border bg-white/90 p-4 shadow-sm">
            <div className="aspect-square rounded-xl bg-slate-100" />
          </div>

          <div className="space-y-5">
            <div className="h-8 w-3/4 rounded bg-slate-100" />

            <div className="flex flex-wrap items-center gap-3">
              <div className="h-8 w-24 rounded bg-slate-100" />
              <div className="h-6 w-20 rounded-full bg-slate-100" />
              <div className="h-6 w-16 rounded-full bg-slate-100" />
            </div>

            <div className="rounded-2xl border bg-white/90 p-5 shadow-sm">
              <div className="h-4 w-full rounded bg-slate-100" />
              <div className="mt-2 h-4 w-11/12 rounded bg-slate-100" />
              <div className="mt-2 h-4 w-10/12 rounded bg-slate-100" />
              <div className="mt-2 h-4 w-9/12 rounded bg-slate-100" />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="h-12 flex-1 rounded-xl bg-slate-100" />
              <div className="h-12 flex-1 rounded-xl bg-slate-100" />
            </div>

            <div className="h-10 rounded-xl bg-slate-100" />
          </div>
        </div>

        <div className="mt-10">
          <div className="flex items-end justify-between">
            <div className="h-6 w-48 rounded bg-slate-100" />
            <div className="h-4 w-40 rounded bg-slate-100" />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-white/90 p-3 shadow-sm"
              >
                <div className="aspect-square rounded-xl bg-slate-100" />
                <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                <div className="mt-2 h-4 w-3/4 rounded bg-slate-100" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
