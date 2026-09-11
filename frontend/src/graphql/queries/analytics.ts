import { gql } from "@apollo/client";


export const AnalyticsQuery = gql`
query Analytics {
  analytics {
    totalUsers
    totalPosts
    totalCategories
    totalComments
  }
}
`;

