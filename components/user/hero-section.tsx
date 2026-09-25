"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Building2,
  Link2,
  Calendar,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { GithubIcon } from "@/components/icons/github";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyToast } from "@/components/shared/copy-toast";

export interface GitHubUser {
  avatar_url: string;
  name: string | null;
  login: string;
  bio: string | null;
  company: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  html_url: string;
}

interface HeroSectionProps {
  user: GitHubUser;
}

export function HeroSection({ user }: HeroSectionProps) {
  const [copied, setCopied] = useState(false);

  const formattedJoinDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  const blogUrl = user.blog
    ? user.blog.startsWith("http://") || user.blog.startsWith("https://")
      ? user.blog
      : `https://${user.blog}`
    : null;

  const handleCopyUsername = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(`@${user.login}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <>
      <section className="relative w-full overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="hero-glow" />

        {/* ── 1. Cover Banner (edge-to-edge) ── */}
        <div className="relative h-[220px] w-full sm:h-[260px] md:h-[280px] overflow-hidden bg-zinc-950">
          {/* Subtle Gradient Mesh Background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.3),rgba(99,102,241,0.2),rgba(147,51,234,0.1),transparent)]" />

          {/* Geometric Grid Pattern Overlay */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.4) 1px, transparent 0)`,
              backgroundSize: "28px 28px",
            }}
          />

          {/* Noise / Ambient Accent streaks */}
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute -top-12 right-1/4 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 h-64 w-96 rounded-full bg-purple-600/10 blur-3xl" />

          {/* Fade Overlay to Zinc-950 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950" />
        </div>

        {/* ── 2. Profile Details Container ── */}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-16 sm:-mt-20 md:-mt-24 pb-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              {/* Left Column: Avatar + Profile Info */}
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 sm:gap-6">
                {/* Avatar with glow and hover animation */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="group relative"
                >
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-[120px] md:w-[120px] rounded-full ring-4 ring-zinc-950 ring-offset-4 ring-offset-blue-500/20 shadow-2xl transition-all duration-300 group-hover:ring-offset-blue-500/40 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.35)] overflow-hidden bg-zinc-900">
                    <img
                      src={user.avatar_url}
                      alt={user.name || user.login}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  {/* Subtle pulsing status dot */}
                  <span className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 flex h-4 w-4">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-zinc-950 bg-emerald-500" />
                  </span>
                </motion.div>

                {/* Name, Username & Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  className="flex flex-col space-y-1.5"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
                      {user.name || user.login}
                    </h1>

                    {/* Interactive Copyable @username */}
                    <button
                      type="button"
                      onClick={handleCopyUsername}
                      title="Click to copy @username"
                      className="group/tag inline-flex items-center gap-1.5 rounded-lg border border-zinc-800/80 bg-zinc-900/60 px-2.5 py-1 text-xs sm:text-sm font-medium text-zinc-400 backdrop-blur-md transition-all hover:border-zinc-700 hover:bg-zinc-800 hover:text-zinc-200 active:scale-95"
                    >
                      <span>@{user.login}</span>
                      {copied ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400 transition-all" />
                      ) : (
                        <Copy className="h-3.5 w-3.5 text-zinc-500 transition-colors group-hover/tag:text-zinc-300" />
                      )}
                    </button>
                  </div>

                  {/* Bio */}
                  {user.bio && (
                    <p className="max-w-2xl text-sm sm:text-base text-zinc-300 leading-relaxed pt-1">
                      {user.bio}
                    </p>
                  )}
                </motion.div>
              </div>

              {/* Right Column: Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="flex items-center gap-3 shrink-0 self-start md:self-end pt-2 md:pt-0"
              >
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto gap-2 border-zinc-700/80 hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-300"
                  >
                    <GithubIcon className="h-4 w-4" />
                    <span>View on GitHub</span>
                    <ExternalLink className="h-3.5 w-3.5 text-zinc-400" />
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Badges Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="mt-5 flex flex-wrap items-center gap-2 sm:gap-3"
            >
              {user.location && (
                <Badge
                  variant="muted"
                  className="gap-1.5 py-1 text-xs text-zinc-300"
                >
                  <MapPin className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{user.location}</span>
                </Badge>
              )}

              {user.company && (
                <Badge
                  variant="muted"
                  className="gap-1.5 py-1 text-xs text-zinc-300"
                >
                  <Building2 className="h-3.5 w-3.5 text-zinc-400" />
                  <span>{user.company}</span>
                </Badge>
              )}

              {blogUrl && (
                <a
                  href={blogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-transform hover:scale-105"
                >
                  <Badge
                    variant="muted"
                    className="gap-1.5 py-1 text-xs text-blue-400 hover:text-blue-300 hover:border-blue-500/40"
                  >
                    <Link2 className="h-3.5 w-3.5 text-blue-400" />
                    <span className="truncate max-w-50px">
                      {user.blog?.replace(/^https?:\/\//, "")}
                    </span>
                  </Badge>
                </a>
              )}

              {formattedJoinDate && (
                <Badge
                  variant="muted"
                  className="gap-1.5 py-1 text-xs text-zinc-400"
                >
                  <Calendar className="h-3.5 w-3.5 text-zinc-500" />
                  <span>Joined {formattedJoinDate}</span>
                </Badge>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Floating Toast Notification */}
      <CopyToast
        show={copied}
        message={`Copied @${user.login} to clipboard!`}
      />
    </>
  );
}
