import { NextResponse } from "next/server";
import { compareGitHubUsers } from "@/lib/api/github/services/compare";
import { GitHubGraphQLError } from "@/lib/api/github";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const user1 = searchParams.get("user1")?.trim();
  const user2 = searchParams.get("user2")?.trim();

  if (!user1 || !user2) {
    return NextResponse.json(
      { error: "Both user1 and user2 query parameters are required." },
      { status: 400 },
    );
  }

  if (user1.toLowerCase() === user2.toLowerCase()) {
    return NextResponse.json(
      { error: "Please pick two different GitHub accounts to compare." },
      { status: 400 },
    );
  }

  try {
    const result = await compareGitHubUsers(user1, user2);
    return NextResponse.json(result);
  } catch (err: any) {
    if (err instanceof GitHubGraphQLError) {
      return NextResponse.json(
        { error: err.message },
        { status: err.status || 500 },
      );
    }
    return NextResponse.json(
      { error: err?.message || "Failed to compare users." },
      { status: 500 },
    );
  }
}
