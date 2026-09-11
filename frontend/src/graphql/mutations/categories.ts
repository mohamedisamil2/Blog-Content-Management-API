import { gql } from "@apollo/client";



export const CreateCategory = gql`
mutation CreateCategory($name:String!){
  createCategory(name: $name) {
    name
  }
}
`;