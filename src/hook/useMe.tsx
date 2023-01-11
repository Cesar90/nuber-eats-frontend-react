import { gql, useQuery } from "@apollo/client";
import { meQuery } from "../__generated__/meQuery";

//Sometimes this query is called in several places but apollo uses cache for the data
export const ME_QUERY = gql`
  query meQuery{
    me{
      id
      email
      role
      verified
    }
  }
`

export const useMe = () => {
  return useQuery<meQuery>(ME_QUERY)
}