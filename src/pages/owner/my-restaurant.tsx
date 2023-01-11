import { gql, useQuery, useSubscription } from "@apollo/client"
import React, {useEffect} from "react"
import { Link, useHistory, useParams } from "react-router-dom"
import { DISH_FRAGMENT, FULL_ORDER_FRAGMENT, ORDERS_FRAGMENT, RESTAURANT_FRAGMENT } from "../../fragments"
import { myRestaurant, myRestaurantVariables } from "../../__generated__/myRestaurant"
import { Dish } from "../../components/dish"
import { Helmet } from "react-helmet-async";

import {
  VictoryAxis,
  VictoryChart,
  VictoryLabel,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
  VictoryTooltip,
  VictoryVoronoiContainer,
  VictoryBar
} from "victory";
import { pendingOrders } from "../../__generated__/pendingOrders"

export const MY_RESTAURANT_QUERY = gql`
  query myRestaurant($input: MyRestaurantInput!){
    myRestaurant(input: $input){
      ok
      error
      restaurant{
        ...RestaurantParts
        menu{
          ...DishParts
        }
        orders{
          ...OrderParts
        }
      }
    }
  }
  ${RESTAURANT_FRAGMENT}
  ${DISH_FRAGMENT}
  ${ORDERS_FRAGMENT}
`

const PENDING_ORDERS_SUBSCRIPTION = gql`
  subscription pendingOrders{
    pendingOrders{
      ...FullOrderParts
    }
  }
  ${FULL_ORDER_FRAGMENT}
`

interface IParms{
  id:string
}

export const MyRestaurant = () => {
  const {id} = useParams<IParms>()
  const { data } = useQuery<myRestaurant, myRestaurantVariables>(MY_RESTAURANT_QUERY,{
    variables:{
      input:{
        id: +id
      }
    }
  })

  const chartData = [
    { x: 1, y: 3000 },
    { x: 2, y: 1500 },
    { x: 3, y: 4200 },
    { x: 4, y: 1250},
    { x: 5, y: 2300 },
    { x: 6, y: 7150 },
    { x: 7, y: 6830 },
    { x: 8, y: 6830 },
    { x: 9, y: 6830 },
    { x: 10, y: 6830 },
  ]
  const { data: subscriptionData } = useSubscription<pendingOrders>(PENDING_ORDERS_SUBSCRIPTION)
  const history = useHistory()
  useEffect(() => {
    if(subscriptionData?.pendingOrders.id){
      history.push(`/orders/${subscriptionData?.pendingOrders.id}`)
    }
  }, [subscriptionData])

  return (
    <div>
      <Helmet>
        <title>
          {data?.myRestaurant.restaurant?.name || "Loading..."} | Nuber Eats
        </title>
        <script src="https://cdn.paddle.com/paddle/paddle.js"></script>
      </Helmet>
      <div className="bg-gray-700 py-28 bg-center bg-cover" style={{
        backgroundImage: `url(${data?.myRestaurant.restaurant?.coverImg})`
      }}>
      </div>
      <div className="container mt-10">
        <h2 className="text-4xl font-medium mb-10">
          {data?.myRestaurant.restaurant?.name || "Loading..."}
        </h2>
        <Link to={`/restaurants/${id}/add-dish`} className="mr-8 text-white bg-gray-800 py-3 px-10">
          Add Dish &rarr;
        </Link>
        <Link to={``} className="text-white bg-lime-700 py-3 px-10">
          Buy Promotion &rarr;
        </Link>
        <div className="mt-10">
          {data?.myRestaurant.restaurant?.menu.length === 0 ? (
            <h4 className="text-xl mb-5">
              Plase upload a dish
            </h4>
          ) : (
            <div className="grid mt-6 md:grid-cols-3 gap-x-5 gap-y-10">
              {data?.myRestaurant.restaurant?.menu.map((dish) =>(
                <Dish 
                  name={dish.name}
                  description={dish.description}
                  price={dish.price}

                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-20 mb-10">
            <h4 className="text-center text-2xl font-medium">Sales</h4>
            <div className="  mt-10">
            <VictoryChart
              height={500}
              theme={VictoryTheme.material}
              width={window.innerWidth}
              domainPadding={50}
              containerComponent={<VictoryVoronoiContainer />}
            >
              <VictoryLine
                labels={({ datum }) => `$${datum.y}`}
                labelComponent={
                  <VictoryTooltip
                    style={{ fontSize: 18 } as any}
                    renderInPortal
                    dy={-20}
                  />
                }
                data={data?.myRestaurant.restaurant?.orders.map((order) => ({
                  x: order.createdAt,
                  y: order.total,
                }))}
                interpolation="natural"
                style={{
                  data: {
                    strokeWidth: 5,
                  },
                }}
              />
              <VictoryAxis
                tickLabelComponent={<VictoryLabel renderInPortal />}
                style={{
                  tickLabels: {
                    fontSize: 20,
                  } as any,
                }}
                tickFormat={(tick) => new Date(tick).toLocaleDateString("ko")}
              />
            </VictoryChart>
          </div>
            <div className="max-w-lg w-full mx-auto">
              {/* <VictoryChart domainPadding={20}>
                  <VictoryAxis 
                    tickFormat={(step) => `$${step/1000}K`}
                    dependentAxis
                  />
                  <VictoryAxis
                    tickFormat={(step) => `Day ${step}`}
                    label="Days"
                  />
                  <VictoryBar data={chartData} 
                  />
              </VictoryChart>
              <VictoryChart domainPadding={20}>
                <VictoryPie data={chartData} />
              </VictoryChart> */}
            </div>
            
        </div>
      </div>
    </div>
  )
}