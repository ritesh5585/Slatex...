"use client";

import { motion } from "framer-motion";
import { BookOpen, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ReactNode } from "react";

interface StatsCardsProps {
  publicRepos: number;
  followers: number;
  following: number;
}

// Shared card shell — top gradient line + hover lift + glass border
function StatCard({ children }: { children: ReactNode }) {
  return (
    <Card className="group relative h-full overflow-hidden p-5 transition-all duration-300 hover:border-zinc-700/90 ">
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-zinc-700/60 to-transparent opacity-0 transition-opacity duration-300 " />
      {children}
    </Card>
  );
}

// Shared label style
const LABEL = "text-sm font-medium uppercase tracking-wider text-zinc-400";
const NUMBER = "font-bold tracking-tight text-white tabular-nums";

// Reusable fade-up motion variant
const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay },
});

export function StatsCards({
  publicRepos,
  followers,
  following,
}: StatsCardsProps) {
  return (
    <section className="flex w-full justify-center">
      <div className="grid w-full max-w-[1400px] grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2">
        {/* ── Repos Card ── */}
        <motion.div className="md:col-span-2" {...fadeUp(0.15)}>
          <StatCard>
            <div className="flex items-center justify-center gap-5 sm:gap-7 md:gap-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 ring-1 ring-blue-500/20 sm:h-20 sm:w-20">
                <BookOpen className="h-8 w-8 text-blue-400 sm:h-9 sm:w-9" />
              </div>
              <div className="text-center">
                <div className={`text-5xl sm:text-6xl md:text-7xl ${NUMBER}`}>
                  {publicRepos.toLocaleString()}
                </div>
                <div className={`${LABEL} mt-2 text-base tracking-[0.18em] sm:text-lg`}>
                  Public Repositories
                </div>
              </div>
            </div>
          </StatCard>
        </motion.div>

        {/* ── Community Card ── */}
        <motion.div className="md:col-span-2" {...fadeUp(0.23)}>
          <StatCard>
            <div className="mb-4 flex items-center gap-3 text-indigo-400">
              <Users className="h-6 w-6" />
              <span className={LABEL}>Community</span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-zinc-700/60 text-center">
              {[
                { value: followers, label: "Followers" },
                { value: following, label: "Following" },
              ].map(({ value, label }) => (
                <div key={label}>
                  <div className={`text-3xl ${NUMBER}`}>
                    {value.toLocaleString()}
                  </div>
                  <div className={LABEL}>{label}</div>
                </div>
              ))}
            </div>
          </StatCard>
        </motion.div>
      </div>
    </section>
  );
}
