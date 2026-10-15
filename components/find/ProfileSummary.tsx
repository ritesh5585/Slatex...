"use client";

interface ProfileSummaryProps {
  avatarUrl: string;
  username: string;
  summaryText: string;
}

/**
 * One-row profile summary: avatar | username | summary text
 * Separated by a subtle divider below.
 */
export function ProfileSummary({
  avatarUrl,
  username,
  summaryText,
}: ProfileSummaryProps) {
  return (
    <div
      className="flex items-start gap-3 py-4 border-b"
      style={{ borderColor: "var(--border)" }}
    >
      {/* Avatar */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={avatarUrl}
        alt={`${username} avatar`}
        width={40}
        height={40}
        className="rounded-full shrink-0 ring-1 ring-zinc-700"
      />

      {/* Text */}
      <div className="min-w-0">
        <p
          className="text-sm font-medium leading-tight"
          style={{ color: "var(--text-primary)" }}
        >
          {username}
        </p>
        <p
          className="text-sm leading-snug mt-0.5"
          style={{ color: "var(--text-secondary)" }}
        >
          {summaryText}
        </p>
      </div>
    </div>
  );
}
