
export const analyticsTypeDefs = `#graphql

type Analytics{
    totalUsers:Int!
    totalPosts:Int!
    totalCategories:Int!
    totalComments:Int!
}

type Query{
    analytics:Analytics!
}

`;