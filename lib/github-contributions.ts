// lib/github-contributions.ts

export interface ContributionDay {
  date: string;
  count: number;
}

export interface ContributionData {
  contributions: ContributionDay[];
  totalContributions: number;
}

interface GitHubPublicEvent {
  type: string;
  created_at: string;
  payload?: {
    commits?: unknown[];
  };
}

async function fetchPublicActivity(username: string): Promise<ContributionData> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/events/public?per_page=100`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "DevScan-Dashboard",
        },
        next: { revalidate: 3600 },
      },
    );

    if (!res.ok) return { contributions: [], totalContributions: 0 };

    const events: GitHubPublicEvent[] = await res.json();
    const counts = new Map<string, number>();

    for (const event of events) {
      const date = event.created_at.slice(0, 10);
      if (!date) continue;

      const amount =
        event.type === "PushEvent"
          ? Math.max(event.payload?.commits?.length ?? 0, 1)
          : 1;
      counts.set(date, (counts.get(date) ?? 0) + amount);
    }

    const contributions = [...counts.entries()]
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([date, count]) => ({ date, count }));

    return {
      contributions,
      totalContributions: contributions.reduce((sum, day) => sum + day.count, 0),
    };
  } catch (error) {
    console.error("Public activity fetch failed:", error);
    return { contributions: [], totalContributions: 0 };
  }
}

export async function fetchContributions(
  username: string,
): Promise<ContributionData> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return fetchPublicActivity(username);
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                date
                contributionCount
              }
            }
          }
        }
      }
    }
  `;

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { username },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) return { contributions: [], totalContributions: 0 };

    const json = await res.json();
    const calendar =
      json?.data?.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) return { contributions: [], totalContributions: 0 };

    const contributions: ContributionDay[] = calendar.weeks.flatMap(
      (week: any) =>
        week.contributionDays.map((d: any) => ({
          date: d.date,
          count: d.contributionCount,
        })),
    );

    return {
      contributions,
      totalContributions: calendar.totalContributions,
    };
  } catch (err) {
    console.error("Contribution fetch failed:", err);
    return { contributions: [], totalContributions: 0 };
  }
}
