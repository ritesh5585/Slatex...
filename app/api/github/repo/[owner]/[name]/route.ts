import { NextResponse } from "next/server";
import { getRepo } from "@/lib/api/github";
import { withGithubErrors } from "@/lib/api/with-github-errors";

export const GET = withGithubErrors(
  async (
    _req: Request,
    { params }: { params: Promise<{ owner: string; name: string }> },
  ) => {
    const { owner, name } = await params;
    const repo = await getRepo(owner, name);
    return NextResponse.json(repo);
  },
);
