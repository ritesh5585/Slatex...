 export const COMPARE_QUERY = `
  query CompareUsers($u1: String!, $u2: String!) {
    user1: user(login: $u1) {
      login
      name
      avatarUrl
      bio
      location
      company
      url
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
      contributionsCollection {
        totalContributions
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      topRepos: repositories(
        first: 6
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          id
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
        }
      }
      languages: repositories(
        first: 100
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          primaryLanguage { name color }
          stargazerCount
        }
      }
    }
    user2: user(login: $u2) {
      login
      name
      avatarUrl
      bio
      location
      company
      url
      createdAt
      followers { totalCount }
      following { totalCount }
      repositories(privacy: PUBLIC, ownerAffiliations: OWNER) { totalCount }
      contributionsCollection {
        totalContributions
        totalCommitContributions
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
      topRepos: repositories(
        first: 6
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: { field: STARGAZERS, direction: DESC }
      ) {
        nodes {
          id
          name
          description
          url
          stargazerCount
          forkCount
          primaryLanguage { name color }
        }
      }
      languages: repositories(
        first: 100
        privacy: PUBLIC
        ownerAffiliations: OWNER
        orderBy: { field: PUSHED_AT, direction: DESC }
      ) {
        nodes {
          primaryLanguage { name color }
          stargazerCount
        }
      }
    }
  }
`;