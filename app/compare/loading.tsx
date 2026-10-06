export default function CompareLoading() {
  return (
    <div className="flex h-screen bg-[#08090f] text-zinc-100 antialiased overflow-hidden">
      {/* Desktop Sidebar Skeleton */}
      <div className="hidden md:flex w-56 shrink-0 flex-col h-full bg-[#0d0e17] border-r border-zinc-800/60 py-5 px-2">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-7">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 animate-pulse" />
          <div className="h-4 w-20 rounded bg-zinc-800 animate-pulse" />
        </div>
        {/* Nav Items */}
        <div className="flex flex-col gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${i === 4 ? "bg-indigo-600/30" : ""
                }`}
            >
              <div className="w-4 h-4 rounded bg-zinc-800 animate-pulse shrink-0" />
              <div
                className="h-3 rounded bg-zinc-800 animate-pulse"
                style={{ width: `${50 + i * 10}px` }}
              />
            </div>
          ))}
        </div>
        {/* Recently viewed */}
        <div className="mt-7">
          <div className="h-2.5 w-24 rounded bg-zinc-800/70 animate-pulse px-3 mb-3 ml-3" />
          <div className="flex flex-col gap-1.5 px-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 shrink-0" />
                <div className="h-2.5 w-28 rounded bg-zinc-800 animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content Area ────────────────────────────────────────────── */}
      <div className="relative flex-1 flex flex-col min-w-0 overflow-hidden bg-[#08090f]">
        {/* Subtle background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-transparent to-purple-900/5 pointer-events-none" />

        <div className="relative z-10 flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full space-y-7">

          {/* Page Title */}
          <div className="space-y-2">
            <div className="h-8 w-56 rounded-xl bg-zinc-800 animate-pulse" />
            <div className="h-4 w-80 rounded bg-zinc-800/70 animate-pulse" />
          </div>

          {/* Search Bar Skeleton */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full">
            <div className="flex-1 w-full h-12 rounded-xl bg-[#0e111c] border border-zinc-800 animate-pulse" />
            <div className="w-full sm:w-28 h-11 rounded-xl bg-zinc-700/50 animate-pulse" />
          </div>

          {/* Preset Links Skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-3 w-10 rounded bg-zinc-800 animate-pulse" />
            {[80, 95, 75].map((w, i) => (
              <div key={i} className={`h-3 rounded bg-zinc-800 animate-pulse`} style={{ width: `${w}px` }} />
            ))}
          </div>

          {/* Profile Identity Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {["blue", "amber"].map((accent) => (
              <div
                key={accent}
                className="flex items-center gap-4 p-4 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60"
              >
                {/* Avatar */}
                <div
                  className={`w-14 h-14 rounded-full shrink-0 animate-pulse ${accent === "blue" ? "bg-blue-900/40" : "bg-amber-900/40"
                    }`}
                />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-36 rounded bg-zinc-700 animate-pulse" />
                  <div className="h-3 w-24 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-3 w-32 rounded bg-zinc-800 animate-pulse" />
                </div>
              </div>
            ))}
          </div>

          {/* Verdict Line Skeleton */}
          <div className="h-4 w-full max-w-2xl rounded bg-zinc-800 animate-pulse" />

          {/* Head-to-Head Analysis Section */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <div className="h-5 w-64 rounded bg-zinc-800 animate-pulse" />
              <div className="h-6 w-36 rounded-full bg-indigo-900/40 animate-pulse" />
            </div>

            {/* 3 Domain Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/70 space-y-2"
                >
                  <div className="h-3 w-20 rounded bg-zinc-800 animate-pulse" />
                  <div className="h-4 w-28 rounded bg-zinc-700 animate-pulse" />
                  <div className="h-3 w-36 rounded bg-zinc-800/70 animate-pulse" />
                </div>
              ))}
            </div>

            {/* Language Summary Card */}
            <div className="p-4 rounded-xl border border-zinc-800 bg-[#0e111c]/70 space-y-2">
              <div className="h-3 w-44 rounded bg-zinc-800 animate-pulse" />
              <div className="h-3 w-full max-w-xl rounded bg-zinc-800/70 animate-pulse" />
              <div className="h-3 w-4/5 rounded bg-zinc-800/50 animate-pulse" />
              <div className="flex gap-2 pt-1">
                <div className="h-5 w-40 rounded-full bg-blue-900/30 animate-pulse" />
                <div className="h-5 w-40 rounded-full bg-amber-900/30 animate-pulse" />
              </div>
            </div>

            {/* Strengths Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {["blue", "amber"].map((accent) => (
                <div
                  key={accent}
                  className={`p-3.5 rounded-xl border ${accent === "blue" ? "border-blue-900/30" : "border-amber-900/30"
                    } bg-[#0e111c]/60 space-y-2`}
                >
                  <div className={`h-3 w-32 rounded animate-pulse ${accent === "blue" ? "bg-blue-900/50" : "bg-amber-900/50"}`} />
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-start gap-1.5">
                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 mt-0.5 animate-pulse ${accent === "blue" ? "bg-blue-900/60" : "bg-amber-900/60"}`} />
                      <div className="h-3 w-full rounded bg-zinc-800 animate-pulse" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Numbers Section */}
          <div className="space-y-3">
            <div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" />
            <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="grid grid-cols-[60px_1fr_auto_1fr_60px] sm:grid-cols-[80px_1fr_130px_1fr_80px] items-center gap-2 sm:gap-3 py-1.5"
                >
                  {/* Left value */}
                  <div className="h-3.5 w-10 rounded bg-zinc-700 animate-pulse ml-auto" />
                  {/* Left bar */}
                  <div className="flex justify-end">
                    <div
                      className="h-2 rounded-full bg-blue-700/40 animate-pulse"
                      style={{ width: `${30 + Math.random() * 60}%` }}
                    />
                  </div>
                  {/* Label */}
                  <div className="h-3 rounded bg-zinc-800 animate-pulse mx-auto" style={{ width: "80px" }} />
                  {/* Right bar */}
                  <div className="flex justify-start">
                    <div
                      className="h-2 rounded-full bg-amber-700/40 animate-pulse"
                      style={{ width: `${30 + Math.random() * 60}%` }}
                    />
                  </div>
                  {/* Right value */}
                  <div className="h-3.5 w-10 rounded bg-zinc-700 animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Contributions Per Month Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-5 w-52 rounded bg-zinc-800 animate-pulse" />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-blue-700/50 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-zinc-800 animate-pulse" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-sm bg-amber-700/50 animate-pulse" />
                  <div className="h-3 w-16 rounded bg-zinc-800 animate-pulse" />
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60">
              {/* Bar Chart Skeleton */}
              <div className="w-full h-60 sm:h-64 flex items-end gap-1.5 px-2 pb-4">
                {[45, 70, 55, 80, 40, 90, 60, 75, 50, 85, 65, 55].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end gap-1">
                    <div
                      className="w-full flex gap-0.5 items-end"
                    >
                      <div
                        className="flex-1 rounded-t bg-blue-700/30 animate-pulse"
                        style={{ height: `${h * 0.6}px` }}
                      />
                      <div
                        className="flex-1 rounded-t bg-amber-700/30 animate-pulse"
                        style={{ height: `${h}px` }}
                      />
                    </div>
                    <div className="h-2 w-4 rounded bg-zinc-800 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Languages Section */}
          <div className="space-y-3">
            <div className="h-5 w-24 rounded bg-zinc-800 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["blue", "amber"].map((accent) => (
                <div
                  key={accent}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-800/80 bg-[#0e111c]/60 space-y-3"
                >
                  <div className="h-3 w-40 rounded bg-zinc-800 animate-pulse" />
                  {/* Segmented bar */}
                  <div className="flex h-2.5 w-full overflow-hidden rounded-full gap-0.5">
                    {[57, 19, 10, 14].map((w, i) => (
                      <div
                        key={i}
                        className="h-full rounded-full animate-pulse"
                        style={{
                          width: `${w}%`,
                          backgroundColor: ["#1e3a5f", "#3f2d1a", "#1a2a3a", "#2a2a2a"][i],
                        }}
                      />
                    ))}
                  </div>
                  {/* Language List */}
                  <div className="space-y-2 pt-1">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 animate-pulse" />
                          <div className="h-3 w-20 rounded bg-zinc-800 animate-pulse" />
                        </div>
                        <div className="h-3 w-12 rounded bg-zinc-800 animate-pulse" />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Most Starred Repos */}
          <div className="space-y-3 pb-8">
            <div className="h-5 w-48 rounded bg-zinc-800 animate-pulse" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1].map((col) => (
                <div key={col} className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-zinc-800/80 bg-[#0e111c]/60 flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="h-3.5 w-36 rounded bg-zinc-700 animate-pulse" />
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-zinc-700 animate-pulse" />
                          <div className="h-2.5 w-16 rounded bg-zinc-800 animate-pulse" />
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <div className="w-3.5 h-3.5 rounded bg-amber-900/40 animate-pulse" />
                        <div className="h-3 w-14 rounded bg-zinc-800 animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
