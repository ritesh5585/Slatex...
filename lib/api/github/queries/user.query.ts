export const GET_USER_QUERY = `
  query GetUser($username: String!) {
    user(login: $username) {
      login
      name
      avatarUrl
      bio
      location
      company
      websiteUrl
      followers { totalCount }
      following { totalCount }
      repositories(privacy: PUBLIC) { totalCount }
      createdAt
      url
    }
  }
`;
export const GET_USER_REPOS_QUERY = `
  query GetUserRepos($username: String!) {
    user(login: $username) {
      repositories(
        first: 20
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
    }
  }
`;