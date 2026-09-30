export const GET_COMMIT_HISTORY_QUERY = `
  query GetCommitHistory($owner: String!, $name: String!, $first: Int!, $since: GitTimestamp) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: $first, since: $since) {
              totalCount
              edges {
                node {
                  oid
                  committedDate
                  additions
                  deletions
                  message
                  author { name avatarUrl
                  user {
                      login
                      url
                    } }
                }
              }
            }
          }
        }
      }
    }
  }
`;
