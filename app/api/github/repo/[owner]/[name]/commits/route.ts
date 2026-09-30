// app/api/github/repo/[owner]/[name]/commits/route.ts

import { NextResponse } from "next/server";
import { getCommitHistory, GitHubGraphQLError } from "@/lib/api/github";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ owner: string; name: string }> },
) {
  const { owner, name } = await params;

  const { searchParams } = new URL(req.url);
  const first = parseInt(searchParams.get("first") ?? "30", 10);

  try {
    const commits = await getCommitHistory(owner, name, first, searchParams.get("since") ?? undefined);
    return NextResponse.json(commits);
  } catch (err) {
    if (err instanceof GitHubGraphQLError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status || 500 },
      );
    }
    return NextResponse.json({ error: "Unknown error" }, { status: 500 });
  }
}
