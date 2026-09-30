import { NextResponse } from "next/server";
import { getUserByUsername, GitHubGraphQLError } from "@/lib/api/github";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ username: string }> },
) {
  const { username } = await params;
  try {
    const user = await getUserByUsername(username);
    return NextResponse.json(user);
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