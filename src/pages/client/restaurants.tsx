import { gql, useQuery } from "@apollo/client"
import { url } from "inspector"
import React,{useState} from "react"
import { restaurantsPageQuery, restaurantsPageQueryVariables } from "../../__generated__/restaurantsPageQuery"
import { Restaurant } from "../../components/restaurant"
import { useForm } from "react-hook-form"
import { Link, useHistory } from "react-router-dom"
import { Helmet } from "react-helmet"


const RESTAURANTS_QUERY = gql`
  query restaurantsPageQuery($input: RestaurantsInput!){
    allCategories{
      ok
      error
      categories{
        id
        name
        coverImg
        slug
        restaurantCount
      }
    }
    restaurants(input:$input){
      ok
      error
      totalPages
      totalResults
      results{
        id
        name
        coverImg
        category{
          name
        }
        address
        isPromoted
      }
    }
  }
`

interface IFormProps{
  searchTerm: string
}

export const Restaurants = () => {
  const [page, setPage] = useState(1)
  const { data, loading } = useQuery<
    restaurantsPageQuery,
    restaurantsPageQueryVariables>(RESTAURANTS_QUERY,{
      variables: {
        input:{
          page
        }
      }
    })
  
    const onNextPageClick = () => setPage(current => current + 1)
    const onPrevPageClick = () => setPage(current => current - 1)
    const { register, handleSubmit, getValues } = useForm<IFormProps>()
    const history = useHistory()
    const onSearchSubmit = () => {
      console.log(getValues())
      const { searchTerm } = getValues()
      history.push({
        pathname:"/search",
        search: `?term=${searchTerm}`
      })
    }

  return <div>
    <Helmet>
      <title>Home | Nuber Eats</title>
    </Helmet>
    <form onSubmit={handleSubmit(onSearchSubmit)} className="bg-gray-800 w-full py-40 flex items-center justify-center">
      <input 
      ref={register({ required:true, min:3 })}
      name="searchTerm"
      type="Search" 
      className="input rounded-md border-0 w-3/4 md:w-3/12" 
      placeholder="Search Restaurants..." />
    </form>
    {!loading && (
    <div className="max-w-screen-2xl pb-20 mx-auto mt-8">
        <div className="flex justify-around max-w-screen-sm mx-auto">
          {data?.allCategories.categories?.map(category => (
            <Link to={`/category/${category.slug}`}>
              <div className="flex flex-col group items-center cursor-pointer">
                <div 
                  key={category.id}
                  className="w-14 h-14 bg-cover rounded-full group-hover:bg-gray-200" 
                  style={{backgroundImage: `url(${category.coverImg})`}}>
                </div>
                <span className="mt-1 text-sm text-center font-medium">{category.name}</span>
              </div>
            </Link>
            
        ))}
        </div>
        <div className="grid mt-16 lg:grid-cols-3 gap-x-5 gap-y-10">
          {data?.restaurants.results?.map((restaurant) => (
            <Restaurant 
              key={restaurant.id}
              id={restaurant.id + ""}
              coverImg={restaurant.coverImg} 
              name={restaurant.name} 
              categoryName={restaurant.category?.name} />
          ))}
        </div>
        <div className="grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10">
           
        {page > 1 ? (
              <button
                onClick={onPrevPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &larr;
              </button>
            ) : (
              <div></div>
            )}
            <span>
              Page {page} of {data?.restaurants.totalPages}
            </span>
            {page !== data?.restaurants.totalPages ? (
              <button
                onClick={onNextPageClick}
                className="focus:outline-none font-medium text-2xl"
              >
                &rarr;
              </button>
            ) : (
              <div></div>
            )}

        </div>
    </div>)}
  </div>
}