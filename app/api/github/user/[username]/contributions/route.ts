import { NextResponse } from "next/server";
import { getUserContributions } from "@/lib/api/github";
import { withGithubErrors } from "@/lib/api/with-github-errors";

export const GET = withGithubErrors(
  async (
    _req: Request,
    { params }: { params: Promise<{ username: string }> },
  ) => {
    const { username } = await params;
    const data = await getUserContributions(username);
    return NextResponse.json(data);
  },
);
