import { NextResponse } from "next/server";
import { ZodError } from "zod";

export class GitHubAPIError extends Error {
  status: number;
  constructor(message: string, status = 502) {
    super(message);
    this.name = "GitHubAPIError";
    this.status = status;
  }
}

export class GitHubGraphQLError extends GitHubAPIError {
  constructor(message: string, status = 502) {
    super(message, status);
    this.name = "GitHubGraphQLError";
  }
}

export class NotFoundError extends GitHubAPIError {
  constructor(resource: string) {
    super(
      resource.endsWith("not found") ? resource : `${resource} not found`,
      404,
    );
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends GitHubAPIError {
  constructor(message = "GitHub API rate limit exceeded") {
    super(message, 429);
    this.name = "RateLimitError";
  }
}

export class AuthError extends GitHubAPIError {
  constructor(message = "Invalid or missing GitHub token") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class NetworkError extends GitHubAPIError {
  constructor(cause?: unknown) {
    super(
      `Network error: ${cause instanceof Error ? cause.message : "unknown"}`,
      502,
    );
    this.name = "NetworkError";
  }
}

export function withGithubErrors<
  T extends (...args: any[]) => Promise<Response>,
>(handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      if (error instanceof ZodError) {
        return NextResponse.json(
          {
            error: "Invalid input",
            details: error.issues.map((e) => ({
              path: e.path.join("."),
              message: e.message,
            })),
          },
          { status: 400 },
        );
      }

      if (error instanceof NotFoundError) {
        return NextResponse.json({ error: error.message }, { status: 404 });
      }

      if (error instanceof RateLimitError) {
        return NextResponse.json({ error: error.message }, { status: 429 });
      }

      if (error instanceof GitHubAPIError) {
        return NextResponse.json(
          { error: error.message },
          { status: error.status },
        );
      }

      console.error("[API Error]", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 },
      );
    }
  }) as T;
}
