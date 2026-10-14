export const GET_REPO_QUERY = `
  query GetRepo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      owner { login avatarUrl }
      description
      url
      homepageUrl
      stargazerCount
      forkCount
      watchers { totalCount }
      issues(states: OPEN) { totalCount }
      pullRequests(states: OPEN) { totalCount }
      primaryLanguage { name color }
      repositoryTopics(first: 10) { nodes { topic { name } } }
      licenseInfo { name spdxId }
      defaultBranchRef { name }
      isPrivate
      isArchived
      updatedAt
      pushedAt
      createdAt
      isFork
    }
  }
`;
