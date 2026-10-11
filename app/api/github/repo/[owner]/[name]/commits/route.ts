import { NextResponse } from "next/server";
import { getCommitHistory } from "@/lib/api/github";
import { withGithubErrors } from "@/lib/api/with-github-errors";

export const GET = withGithubErrors(
  async (
    req: Request,
    { params }: { params: Promise<{ owner: string; name: string }> },
  ) => {
    const { owner, name } = await params;

    const { searchParams } = new URL(req.url);
    const first = parseInt(searchParams.get("first") ?? "30", 10);

    const commits = await getCommitHistory(
      owner,
      name,
      first,
      searchParams.get("since") ?? undefined,
    );
    return NextResponse.json(commits);
  },
);
