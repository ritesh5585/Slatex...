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