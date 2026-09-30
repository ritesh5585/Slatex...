import { NextResponse } from "next/server";
import { getUserContributions, GitHubGraphQLError } from "@/lib/api/github";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;

  try {
    const data = await getUserContributions(username);
    return NextResponse.json(data);
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
