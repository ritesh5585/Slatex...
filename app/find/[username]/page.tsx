import type { Metadata } from "next";
import { AlertCircle, UserX, RefreshCw, GitFork } from "lucide-react";
import { findProjectsForUser } from "@/lib/api/opensource/recommend";
import { FindSearchForm } from "@/components/find/FindSearchForm";
import { FindProjectsResults } from "@/components/find/FindProjectsResults";
import ErrorPage from "@/components/shared/Error";
import { RateLimited } from "@/components/shared/rate-limited";

interface Props {
  params: Promise<{ username: string }>;
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { username } = await params;
  const clean = decodeURIComponent(username).trim().replace(/^@/, "");
  return {
    title: `Find projects for ${clean} — Slatex`,
    description: `Open source project recommendations for GitHub user ${clean}.`,
  };
}

export default async function FindUsernamePage({ params }: Props) {
  const { username } = await params;
  const clean = decodeURIComponent(username).trim().replace(/^@/, "");

  const result = await findProjectsForUser(clean);

  // ── Error states ──────────────────────────────────────────────────────────

  if (result.status === "not_found") {
    return (
      <ErrorPage
        icon={UserX}
        iconClass="bg-red-500/10 text-red-400 ring-red-500/20"
        title="User not found"
        description={
          <>
            Could not find GitHub user{" "}
            <span className="font-semibold" style={{ color: "var(--text-primary)" }}>
              @{clean}
            </span>
            . Check the spelling and try again.
          </>
        }
      />
    );
  }

  if (result.status === "rate_limited") {
    return <RateLimited retryAfter={result.retryAfter} />;
  }

  if (result.status === "error") {
    return (
      <ErrorPage
        icon={AlertCircle}
        iconClass="bg-amber-500/10 text-amber-400 ring-amber-500/20"
        title="Something went wrong"
        description={result.message}
      />
    );
  }

  if (result.status === "no_signals") {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1
            className="text-[20px] font-semibold leading-tight"
            style={{ color: "var(--text-primary)" }}
          >
            Find projects to contribute to
          </h1>
          <p className="mt-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>
            Enter a GitHub username. We read the public profile and suggest open
            source projects that fit.
          </p>
        </div>
        <FindSearchForm defaultValue={clean} />

        {/* No-signal state */}
        <div
          className="flex flex-col items-center gap-4 py-12 rounded-[12px] border text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[12px]"
            style={{ background: "var(--elevated)", color: "var(--text-tertiary)" }}
          >
            <RefreshCw className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              Not enough public activity
            </p>
            <p
              className="mt-1 text-[13px] max-w-sm mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              The profile{" "}
              <span className="font-mono font-medium">@{clean}</span> has no
              public repositories with detectable languages or topics. We can't
              generate meaningful signal from this profile yet.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ───────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div>
        <h1
          className="text-[20px] font-semibold leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Find projects to contribute to
        </h1>
        <p className="mt-1 text-[14px]" style={{ color: "var(--text-secondary)" }}>
          Enter a GitHub username. We read the public profile and suggest open
          source projects that fit.
        </p>
      </div>

      {/* Search form */}
      <FindSearchForm defaultValue={clean} />

      {/* Results */}
      {result.projects.length === 0 ? (
        <div
          className="flex flex-col items-center gap-4 py-12 rounded-[12px] border text-center"
          style={{ borderColor: "var(--border)", background: "var(--surface)" }}
        >
          <div
            className="flex h-12 w-12 items-center justify-center rounded-[12px]"
            style={{ background: "var(--elevated)", color: "var(--text-tertiary)" }}
          >
            <GitFork className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
              No projects found
            </p>
            <p
              className="mt-1 text-[13px] max-w-sm mx-auto leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              We couldn't find matching open source projects right now. This may
              be a GitHub search rate limit. Try again in a few minutes.
            </p>
          </div>
        </div>
      ) : (
        <FindProjectsResults result={result} />
      )}
    </div>
  );
}
