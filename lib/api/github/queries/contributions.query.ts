export const GET_CONTRIBUTIONS_QUERY = `
  query GetContributions($username: String!) {
    user(login: $username) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
      }
    }
  }
`;

export const GET_USER_COMMIT_CONTRIBUTIONS_QUERY = `
  query GetUserCommitContributions($username: String!) {
    user(login: $username) {
      contributionsCollection {
        totalCommitContributions
        totalRepositoriesWithContributedCommits
        contributionCalendar {
          totalContributions
          weeks { contributionDays { date contributionCount } }
        }
        commitContributionsByRepository(maxRepositories: 25) {
          repository {
            id
            name
            description
            url
            stargazerCount
            forkCount
            updatedAt
            isPrivate
            primaryLanguage { name color }
            owner { login avatarUrl }
          }
          contributions(first: 10, orderBy: { field: OCCURRED_AT, direction: DESC }) {
            totalCount
            nodes {
              occurredAt
              commitCount
              url
            }
          }
        }
      }
    }
  }
`;