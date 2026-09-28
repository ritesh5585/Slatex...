export class GitHubGraphQLError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "GitHubGraphQLError";
  }
}

export class NotFoundError extends GitHubGraphQLError {
  constructor(resource: string) {
    super(`${resource} not found on GitHub`, 404);
    this.name = "NotFoundError";
  }
}

export class RateLimitError extends GitHubGraphQLError {
  constructor() {
    super("GitHub API rate limit reached", 403);
    this.name = "RateLimitError";
  }
}

export class AuthError extends GitHubGraphQLError {
  constructor(message = "Invalid or missing GitHub token") {
    super(message, 401);
    this.name = "AuthError";
  }
}

export class NetworkError extends GitHubGraphQLError {
  constructor(cause?: unknown) {
    super(
      `Network error: ${cause instanceof Error ? cause.message : "unknown"}`,
      0,
    );
    this.name = "NetworkError";
  }
}