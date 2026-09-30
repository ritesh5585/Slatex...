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

export const GET_REPO_LANGUAGES_QUERY = `
  query GetRepoLanguages($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      languages(first: 10, orderBy: { field: SIZE, direction: DESC }) {
        edges {
          size
          node { name color }
        }
      }
    }
  }
`;

export const GET_REPO_README_QUERY = `
  query GetRepoReadme($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      object(expression: "HEAD:README.md") {
        ... on Blob { text }
      }
    }
  }
`;
