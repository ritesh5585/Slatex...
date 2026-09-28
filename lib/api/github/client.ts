import {
  AuthError,
  GitHubGraphQLError,
  NetworkError,
  NotFoundError,
  RateLimitError,
} from "./errors";

const GITHUB_GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

interface GraphQLResponse<T> {
  data?: T;
  errors?: { message: string; type?: string }[];
}

export async function githubGraphQL<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new AuthError(
      "GITHUB_TOKEN missing — GraphQL API hamesha auth maangta hai",
    );
  }

  let res: Response;
  try {
    res = await fetch(GITHUB_GRAPHQL_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (err) {
    throw new NetworkError(err);
  }

  if (res.status === 401) throw new AuthError();
  if (res.status === 403) {
    const remaining = res.headers.get("x-ratelimit-remaining");
    if (remaining === "0") throw new RateLimitError();
    throw new GitHubGraphQLError("Access forbidden", 403);
  }
  if (!res.ok)
    throw new GitHubGraphQLError(`GraphQL HTTP ${res.status}`, res.status);

  const json: GraphQLResponse<T> = await res.json();

  if (json.errors?.length) {
    const notFound = json.errors.some((e) => e.type === "NOT_FOUND");
    if (notFound) throw new NotFoundError("Requested resource");
    throw new GitHubGraphQLError(
      json.errors.map((e) => e.message).join(", "),
      400,
    );
  }

  if (!json.data)
    throw new GitHubGraphQLError("Empty response from GitHub", 500);

  return json.data;
}
