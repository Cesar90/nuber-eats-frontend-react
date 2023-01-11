import { gql, useQuery } from "@apollo/client"
import React from "react"
import { useLocation, useParams } from "react-router-dom"
import { RESTAURANT_FRAGMENT, CATEGORY_FRAGMENTS } from "../../fragments"
import { category, categoryVariables } from "../../__generated__/category";

const CATEGORY_QUERY = gql`
  query category($input: CategoryInput!) {
    category(input: $input) {
      ok
      error
      totalPages
      totalResults
      restaurants {
        ...RestaurantParts
      }
      category {
        ...CategoryParts
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${CATEGORY_FRAGMENTS}
`;


interface ICategoryParams{
  slug:string
}

export const Category = () => {
  const pararms = useParams<ICategoryParams>()
  const { data, loading } = useQuery<category, categoryVariables>(CATEGORY_QUERY,{
    variables:{
      input:{
        page:1,
        slug: pararms.slug
      }
    }
  })
  console.log(data)
  return <h1>Category</h1>
}