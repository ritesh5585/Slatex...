import { githubGraphQL } from "../client";
import { COMPARE_QUERY } from "../queries/compare.query";
import { NotFoundError } from "../errors";
import { getLanguageColor } from "@/lib/language-colors";

interface RawUserNode {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  url: string;
  createdAt: string;
  followers: { totalCount: number };
  following: { totalCount: number };
  repositories: { totalCount: number };
  contributionsCollection: {
    totalCommitContributions: number;
    contributionCalendar: {
      totalContributions: number;
      weeks?: {
        contributionDays: {
          date: string;
          contributionCount: number;
        }[];
      }[];
    };
  };
  topRepos: {
    nodes: {
      id: string;
      name: string;
      description: string | null;
      url: string;
      stargazerCount: number;
      forkCount: number;
      primaryLanguage: { name: string; color: string | null } | null;
    }[];
  };
  languages: {
    nodes: {
      primaryLanguage: { name: string; color: string | null } | null;
      stargazerCount: number;
    }[];
  };
}

export interface ComparedUser {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  location: string | null;
  company: string | null;
  url: string;
  createdAt: string;
  joinedFormatted: string;
  followers: number;
  following: number;
  publicRepos: number;
  totalStars: number;
  totalContributions: number;
  totalCommits: number;
  languages: { name: string; count: number; color: string; percent: number }[];
  topRepos: {
    id: string;
    name: string;
    description: string | null;
    url: string;
    stars: number;
    forks: number;
    language: string | null;
    languageColor: string | null;
  }[];
}

export interface MonthlyPoint {
  month: string;
  u1: number;
  u2: number;
}

export interface ComparisonInsight {
  verdict: string;
  overallWinner: string;
  winnerName: string;
  score: { u1Wins: number; u2Wins: number };
  moreProjects: { winner: string; count: number; diff: number };
  bestContent: {
    winner: string;
    stars: number;
    topRepo: string;
    topRepoStars: number;
  };
  mostActive: { winner: string; contributions: number; commits: number };
  languageAnalysis: {
    u1Primary: string;
    u2Primary: string;
    u1Langs: string[];
    u2Langs: string[];
    sharedLangs: string[];
    summary: string;
  };
  strengths: {
    u1: string[];
    u2: string[];
  };
}

export interface ComparisonResult {
  user1: ComparedUser;
  user2: ComparedUser;
  monthlyData: MonthlyPoint[];
  insight: ComparisonInsight;
}

function formatJoinDate(iso: string) {
  try {
    const d = new Date(iso);
    return `joined ${d.toLocaleDateString("en-US", { month: "short", year: "numeric" })}`;
  } catch {
    return "";
  }
}

function normalize(raw: RawUserNode): ComparedUser {
  const totalStars = raw.languages.nodes.reduce(
    (sum, r) => sum + (r.stargazerCount ?? 0),
    0,
  );

  const langMap = new Map<string, { count: number; color: string }>();
  for (const repo of raw.languages.nodes) {
    const lang = repo.primaryLanguage?.name;
    if (!lang) continue;
    const existing = langMap.get(lang);
    const color = repo.primaryLanguage?.color || getLanguageColor(lang);
    if (existing) existing.count += 1;
    else langMap.set(lang, { count: 1, color });
  }

  const sortedLangs = [...langMap.entries()]
    .map(([name, { count, color }]) => ({ name, count, color }))
    .sort((a, b) => b.count - a.count);

  const top4 = sortedLangs.slice(0, 3);
  const otherCount = sortedLangs
    .slice(3)
    .reduce((acc, cur) => acc + cur.count, 0);
  if (otherCount > 0) {
    top4.push({ name: "Other", count: otherCount, color: "#8b949e" });
  }

  const totalRepoCount = top4.reduce((acc, cur) => acc + cur.count, 0) || 1;
  const languagesWithPercent = top4.map((l) => ({
    ...l,
    percent: Math.max(1, Math.round((l.count / totalRepoCount) * 100)),
  }));

  return {
    login: raw.login,
    name: raw.name,
    avatarUrl: raw.avatarUrl,
    bio: raw.bio,
    location: raw.location,
    company: raw.company,
    url: raw.url,
    createdAt: raw.createdAt,
    joinedFormatted: formatJoinDate(raw.createdAt),
    followers: raw.followers.totalCount,
    following: raw.following.totalCount,
    publicRepos: raw.repositories.totalCount,
    totalStars,
    totalContributions:
      raw.contributionsCollection.contributionCalendar?.totalContributions ?? 0,
    totalCommits: raw.contributionsCollection.totalCommitContributions,
    languages: languagesWithPercent,
    topRepos: (raw.topRepos?.nodes || []).map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      url: r.url,
      stars: r.stargazerCount,
      forks: r.forkCount,
      language: r.primaryLanguage?.name ?? null,
      languageColor:
        r.primaryLanguage?.color ??
        (r.primaryLanguage?.name
          ? getLanguageColor(r.primaryLanguage.name)
          : null),
    })),
  };
}

function computeMonthly(raw1: RawUserNode, raw2: RawUserNode): MonthlyPoint[] {
  const days1 =
    raw1.contributionsCollection?.contributionCalendar?.weeks?.flatMap(
      (w) => w.contributionDays,
    ) || [];
  const days2 =
    raw2.contributionsCollection?.contributionCalendar?.weeks?.flatMap(
      (w) => w.contributionDays,
    ) || [];

  const now = new Date();
  const months: { key: string; month: string }[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const month = d.toLocaleString("en-US", { month: "short" });
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ key, month });
  }

  const map1 = new Map<string, number>();
  for (const d of days1) {
    if (d.date) {
      const k = d.date.slice(0, 7);
      map1.set(k, (map1.get(k) || 0) + (d.contributionCount || 0));
    }
  }

  const map2 = new Map<string, number>();
  for (const d of days2) {
    if (d.date) {
      const k = d.date.slice(0, 7);
      map2.set(k, (map2.get(k) || 0) + (d.contributionCount || 0));
    }
  }

  return months.map((m) => ({
    month: m.month,
    u1: map1.get(m.key) || 0,
    u2: map2.get(m.key) || 0,
  }));
}

function generateAnalysis(
  u1: ComparedUser,
  u2: ComparedUser,
): ComparisonInsight {
  const metrics = [
    { label: "Followers", v1: u1.followers, v2: u2.followers },
    { label: "Following", v1: u1.following, v2: u2.following },
    { label: "Public Repos", v1: u1.publicRepos, v2: u2.publicRepos },
    { label: "Stars Received", v1: u1.totalStars, v2: u2.totalStars },
    {
      label: "Contributions",
      v1: u1.totalContributions,
      v2: u2.totalContributions,
    },
    { label: "Commits", v1: u1.totalCommits, v2: u2.totalCommits },
  ];

  let u1Wins = 0;
  let u2Wins = 0;
  for (const m of metrics) {
    if (m.v1 > m.v2) u1Wins++;
    else if (m.v2 > m.v1) u2Wins++;
  }

  const overallWinner =
    u1Wins > u2Wins ? u1.login : u2Wins > u1Wins ? u2.login : "Tie";
  const winnerName =
    u1Wins > u2Wins
      ? u1.name || u1.login
      : u2Wins > u1Wins
        ? u2.name || u2.login
        : "Both Developers";

  const moreProjects = {
    winner: u1.publicRepos >= u2.publicRepos ? u1.login : u2.login,
    count: Math.max(u1.publicRepos, u2.publicRepos),
    diff: Math.abs(u1.publicRepos - u2.publicRepos),
  };

  const top1Repo = u1.topRepos[0] || { name: "N/A", stars: 0 };
  const top2Repo = u2.topRepos[0] || { name: "N/A", stars: 0 };
  const bestContentWinner = u1.totalStars >= u2.totalStars ? u1 : u2;
  const bestContent = {
    winner: bestContentWinner.login,
    stars: bestContentWinner.totalStars,
    topRepo: (bestContentWinner.login === u1.login ? top1Repo : top2Repo).name,
    topRepoStars: (bestContentWinner.login === u1.login ? top1Repo : top2Repo)
      .stars,
  };

  const mostActive = {
    winner:
      u1.totalContributions >= u2.totalContributions ? u1.login : u2.login,
    contributions: Math.max(u1.totalContributions, u2.totalContributions),
    commits:
      u1.totalContributions >= u2.totalContributions
        ? u1.totalCommits
        : u2.totalCommits,
  };

  const u1Langs = u1.languages
    .filter((l) => l.name !== "Other")
    .map((l) => l.name);
  const u2Langs = u2.languages
    .filter((l) => l.name !== "Other")
    .map((l) => l.name);
  const sharedLangs = u1Langs.filter((l) => u2Langs.includes(l));
  const u1Primary = u1Langs[0] || "General";
  const u2Primary = u2Langs[0] || "General";

  let langSummary = "";
  if (sharedLangs.length > 0) {
    langSummary = `Both developers share expertise in ${sharedLangs.join(", ")}, with @${u1.login} focusing heavily on ${u1Primary} and @${u2.login} specializing in ${u2Primary}.`;
  } else {
    langSummary = `@${u1.login} works mainly with ${u1Primary}, whereas @${u2.login} specializes in ${u2Primary}, representing completely distinct technology domains.`;
  }

  // Strengths bullet points
  const u1Strengths: string[] = [];
  if (u1.totalStars > u2.totalStars)
    u1Strengths.push(
      `Higher open-source impact with ${u1.totalStars.toLocaleString()} total stars`,
    );
  if (u1.publicRepos > u2.publicRepos)
    u1Strengths.push(
      `Larger portfolio of public repositories (${u1.publicRepos} projects)`,
    );
  if (u1.totalContributions > u2.totalContributions)
    u1Strengths.push(
      `Higher annual activity (${u1.totalContributions.toLocaleString()} contributions)`,
    );
  if (u1.followers > u2.followers)
    u1Strengths.push(
      `Broader developer audience with ${u1.followers.toLocaleString()} followers`,
    );
  if (u1Strengths.length === 0)
    u1Strengths.push(
      `Specializes in ${u1Primary} with focused project execution`,
    );

  const u2Strengths: string[] = [];
  if (u2.totalStars > u1.totalStars)
    u2Strengths.push(
      `Higher open-source impact with ${u2.totalStars.toLocaleString()} total stars`,
    );
  if (u2.publicRepos > u1.publicRepos)
    u2Strengths.push(
      `Larger portfolio of public repositories (${u2.publicRepos} projects)`,
    );
  if (u2.totalContributions > u1.totalContributions)
    u2Strengths.push(
      `Higher annual activity (${u2.totalContributions.toLocaleString()} contributions)`,
    );
  if (u2.followers > u1.followers)
    u2Strengths.push(
      `Broader developer audience with ${u2.followers.toLocaleString()} followers`,
    );
  if (u2Strengths.length === 0)
    u2Strengths.push(
      `Specializes in ${u2Primary} with focused project execution`,
    );

  let verdict = "";
  if (overallWinner !== "Tie") {
    verdict = `@${overallWinner} leads on ${Math.max(u1Wins, u2Wins)} of 6 categories, showing greater overall momentum across public repositories and contributions.`;
  } else {
    verdict = `Both developers are tied 3–3 across the core metrics, each leading in their respective specialties.`;
  }

  return {
    verdict,
    overallWinner,
    winnerName,
    score: { u1Wins, u2Wins },
    moreProjects,
    bestContent,
    mostActive,
    languageAnalysis: {
      u1Primary,
      u2Primary,
      u1Langs,
      u2Langs,
      sharedLangs,
      summary: langSummary,
    },
    strengths: {
      u1: u1Strengths,
      u2: u2Strengths,
    },
  };
}

export async function compareGitHubUsers(
  username1: string,
  username2: string,
): Promise<ComparisonResult> {
  const u1 = username1.trim().replace(/^@/, "");
  const u2 = username2.trim().replace(/^@/, "");

  if (!u1 || !u2) {
    throw new Error("Both usernames are required to perform a comparison");
  }

  const raw = await githubGraphQL<{
    user1: RawUserNode | null;
    user2: RawUserNode | null;
  }>(COMPARE_QUERY, { u1, u2 });

  if (!raw.user1 && !raw.user2) {
    throw new NotFoundError(`Neither "${u1}" nor "${u2}"`);
  }
  if (!raw.user1) {
    throw new NotFoundError(`User "${u1}"`);
  }
  if (!raw.user2) {
    throw new NotFoundError(`User "${u2}"`);
  }

  const user1 = normalize(raw.user1);
  const user2 = normalize(raw.user2);
  const monthlyData = computeMonthly(raw.user1, raw.user2);
  const insight = generateAnalysis(user1, user2);

  return {
    user1,
    user2,
    monthlyData,
    insight,
  };
}
