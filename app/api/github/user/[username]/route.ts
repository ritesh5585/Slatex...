import { NextResponse } from "next/server";
import { getUserByUsername } from "@/lib/api/github";
import { withGithubErrors } from "@/lib/api/with-github-errors";

export const GET = withGithubErrors(
  async (
    _req: Request,
    { params }: { params: Promise<{ username: string }> },
  ) => {
    const { username } = await params;
    const user = await getUserByUsername(username);
    return NextResponse.json(user);
  },
);
