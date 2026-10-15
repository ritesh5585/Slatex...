export const GET_PROFILE_BUNDLE_QUERY = `
  query GetProfileBundle($username: String!, $reposFirst: Int = 100) {
    rateLimit { cost remaining resetAt }
    user(login: $username) {
      # ── user fields ─────────────────────────────────────────────
      login
      name
      avatarUrl
      bio
      location
      company
      websiteUrl
      followers { totalCount }
      following  { totalCount }
      repositories(privacy: PUBLIC) { totalCount }
      createdAt
      url

      # ── repos ───────────────────────────────────────────────────
      repoList: repositories(
        first: $reposFirst
        ownerAffiliations: OWNER
        orderBy: { field: UPDATED_AT, direction: DESC }
        privacy: PUBLIC
      ) {
        nodes {
          id
          name
          description
          url
          stargazerCount
          forkCount
          updatedAt
          primaryLanguage { name color }
          repositoryTopics(first: 10) { nodes { topic { name } } }
        }
      }

      # ── contributions ───────────────────────────────────────────
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

// ─── Repo bundle ─────────────────────────────────────────────────────────────
// Replaces: GET_REPO_QUERY + GET_REPO_LANGUAGES_QUERY + GET_REPO_README_QUERY
// Cache key: gh:v1:repo-bundle:<owner>/<name>   TTL: 600 s (lowest of the three)
export const GET_REPO_BUNDLE_QUERY = `
  query GetRepoBundle($owner: String!, $name: String!) {
    rateLimit { cost remaining resetAt }
    repository(owner: $owner, name: $name) {
      # ── core repo fields ─────────────────────────────────────────
      name
      owner { login avatarUrl }
      description
      url
      homepageUrl
      stargazerCount
      forkCount
      watchers     { totalCount }
      issues(states: OPEN)       { totalCount }
      pullRequests(states: OPEN) { totalCount }
      primaryLanguage { name color }
      repositoryTopics(first: 10) { nodes { topic { name } } }
      licenseInfo   { name spdxId }
      defaultBranchRef { name }
      isPrivate
      isArchived
      updatedAt
      pushedAt
      createdAt
      isFork

      # ── languages ───────────────────────────────────────────────
      languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
        edges { size node { name color } }
      }

      # ── readme (case variants via aliases) ──────────────────────
      readmeMd:    object(expression: "HEAD:README.md")    { ... on Blob { text } }
      readmeLower: object(expression: "HEAD:readme.md")    { ... on Blob { text } }
      readmeRst:   object(expression: "HEAD:README.rst")   { ... on Blob { text } }
      readmeTxt:   object(expression: "HEAD:README.txt")   { ... on Blob { text } }
    }
  }
`;
