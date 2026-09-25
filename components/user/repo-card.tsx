"use client";

import { motion } from "framer-motion";
import { Star, GitFork, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLanguageColor } from "@/lib/language-colors";
import Link from "next/link";

export interface GitHubRepo {
  id: number;
  name: string;
  owner: {
    login: string;
    avatar_url: string;
  };
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics?: string[];
}

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

export function RepoCard({ repo, index }: RepoCardProps) {
  const languageColor = getLanguageColor(repo.language);
  const displayTopics = repo.topics?.slice(0, 3) || [];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: 0.35,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.16, 1, 0.3, 1],
      }}
      className="h-full"
    >
      <Link
        href={`/repo?owner=${repo.owner.login}&repo=${repo.name}`}
        className="group block h-full select-none"
      >
        <Card className="flex h-full flex-col justify-between p-5 border-zinc-800/80 bg-zinc-900/50 backdrop-blur-md transition-all duration-300 hover:border-zinc-500/60 ">
          {/* Top Section: Title & External Link & Description */}
          <div className="space-y-2.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-base font-semibold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                {repo.name}
              </h3>
              <ExternalLink className="h-4 w-4 shrink-0 text-zinc-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-blue-300 transition-all duration-200" />
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2 min-h-10 leading-relaxed">
              {repo.description || "No description provided."}
            </p>

            {/* Topics Row (if any) */}
            {displayTopics.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {displayTopics.map((topic) => (
                  <Badge
                    key={topic}
                    variant="secondary"
                    className="px-2 py-0 text-[10px] font-normal bg-zinc-800/70 border-zinc-700/50 text-zinc-300"
                  >
                    #{topic}
                  </Badge>
                ))}
                {(repo.topics?.length || 0) > 3 && (
                  <span className="text-[10px] text-zinc-500">
                    +{(repo.topics?.length || 0) - 3}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Section: Language & Stats */}
          <div className="mt-4 flex items-center justify-between border-t border-zinc-800/70 pt-3 text-xs text-zinc-400">
            {/* Left: Language Dot + Name */}
            <div className="flex items-center gap-2 min-w-0">
              {repo.language ? (
                <>
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0 shadow-sm"
                    style={{
                      backgroundColor: languageColor,
                      boxShadow: `0 0 6px ${languageColor}80`,
                    }}
                  />
                  <span className="text-zinc-300 font-medium truncate max-w-27.5">
                    {repo.language}
                  </span>
                </>
              ) : (
                <span className="text-zinc-500">Plain text</span>
              )}
            </div>

            {/* Right: Stars & Forks */}
            <div className="flex items-center gap-3 tabular-nums font-medium text-zinc-400 shrink-0">
              <span className="flex items-center gap-1 hover:text-amber-300 transition-colors">
                <Star className="h-3.5 w-3.5 text-amber-400/80 fill-amber-400/20" />
                <span>{repo.stargazers_count.toLocaleString()}</span>
              </span>
              <span className="flex items-center gap-1 hover:text-zinc-200 transition-colors">
                <GitFork className="h-3.5 w-3.5 text-zinc-500" />
                <span>{repo.forks_count.toLocaleString()}</span>
              </span>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
