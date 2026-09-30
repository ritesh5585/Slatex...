import { NextResponse } from "next/server";
import { getRepo, GitHubGraphQLError } from "@/lib/api/github";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ owner: string; name: string }> },
) {
  const { owner, name } = await params;

  try {
    const repo = await getRepo(owner, name);
    return NextResponse.json(repo);
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
