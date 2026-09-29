export const GET_COMMIT_HISTORY_QUERY = `
  query GetCommitHistory($owner: String!, $name: String!, $since: GitTimestamp) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, since: $since) {
              totalCount
              edges {
                node {
                  committedDate
                  additions
                  deletions
                  message
                  author { name avatarUrl }
                }
              }
            }
          }
        }
      }
    }
  }
`;