export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-950 p-8">
      <div className="mx-auto max-w-5xl space-y-8 animate-pulse">
        <div className="h-40 rounded-3xl bg-zinc-900/60" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-zinc-900/60" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 rounded-xl bg-zinc-900/60" />
          <div className="lg:col-span-2 h-80 rounded-xl bg-zinc-900/60" />
        </div>
      </div>
    </main>
  );
}
