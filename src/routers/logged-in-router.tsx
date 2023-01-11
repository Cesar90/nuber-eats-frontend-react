import React from "react"
// import { useQuery, gql } from '@apollo/client';
// import { isLoggedInVar } from "../apollo"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"; 
// import { meQuery } from "../__generated__/meQuery";
import { Restaurants } from "../pages/client/restaurants";
import { Header } from "../components/header";
import { useMe } from "../hook/useMe";
import { UserRole } from "../__generated__/globalTypes";
import { NotFound } from "../pages/404";
import { ConfirmEmail } from "../pages/user/confirm-email";
import { EditProfile } from "../pages/user/edit-profile";
import { Search } from "../pages/client/search";
import { Category } from "../pages/client/category";
import { Restaurant } from "../pages/client/restaurant";
import { MyRestaurants } from "../pages/owner/my-restaurants";
import { MyRestaurant } from "../pages/owner/my-restaurant";
import { AddRestaurant } from "../pages/owner/add-restaurants";
import { AddDish } from "../pages/owner/add-dish";
import { Order } from "../pages/order";
import { Dashboard } from "../pages/driver/dashboard";

const clientRoutes = [
  { path: "/", component: <Restaurants />},
  { path: "/search", component: <Search />},
  { path: "/category/:slug", component: <Category />},
  { path: "/restaurants/:id", component: <Restaurant />},
];

const commonRoutes = [
  { path: "/confirm", component: <ConfirmEmail /> },
  { path: "/edit-profile", component: <EditProfile /> },
  { path: "/orders/:id", component: <Order /> }
]

const restaurantsRoutes = [
  { path: "/", component: <MyRestaurants /> },
  { path: "/add-restaurant", component: <AddRestaurant />  },
  { path: "/restaurants/:id", component: <MyRestaurant /> },
  { path: "/restaurants/:restaurantId/add-dish" , component: <AddDish /> }
]

const driverRoutes = [
  { path:"/", component: <Dashboard />  }
]


// const ME_QUERY = gql`
//   query meQuery{
//     me{
//       id
//       email
//       role
//       verified
//     }
//   }
// `

export const LoggedInRouter = () => {
  // const { data, loading, error } = useQuery<meQuery>(ME_QUERY)
  const { data, loading, error } = useMe()
  // console.log(data)
  if(loading || !data || error){
    return (
      <div className="h-screen flex justify-center items-center">
        <span className="font-medium text-xl tracking-wide">Loading...</span>
      </div>
    )
  }

  return (
    <Router>
      <Header  />
      <Switch>
          {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
          {data.me.role === UserRole.Owner && 
            restaurantsRoutes.map((route) => (
              <Route exact key={route.path} path={route.path}>
                {route.component}
              </Route>
            ))
          }
          {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route exact key={route.path} path={route.path}>
              {route.component}
            </Route>
          ))}
          {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path}>
            {route.component}
          </Route>
        ))}
        {/* <Redirect to="/" /> */}
        <Route>
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}