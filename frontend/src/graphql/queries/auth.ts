import { gql } from "@apollo/client";

export const ME_Query = gql`
query Me{
    me{
        id
        name
        email
        role
    }
}
`;