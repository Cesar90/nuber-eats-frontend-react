// import { useQuery, gql, useReactiveVar } from '@apollo/client';
import { useReactiveVar } from '@apollo/client';
import React from 'react';
import { LoggedOutRouter } from "../routers/logged-out-router"
import { LoggedInRouter } from '../routers/logged-in-router';
import { isLoggedInVar } from '../apollo';

// const IS_LOGGED_IN = gql`
//   query isLoggedIn{
//     isLoggedIn @client
//   }
// `

export const App = () => {
  // const { data: { isLoggedIn } } = useQuery(IS_LOGGED_IN)
  const isLoggedIn = useReactiveVar(isLoggedInVar)
  console.log(isLoggedIn)
  return isLoggedIn ? <LoggedInRouter /> : <LoggedOutRouter />
}

export default App;
