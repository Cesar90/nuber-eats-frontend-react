import React from "react"
import {Helmet} from "react-helmet-async"
import { gql, useMutation } from '@apollo/client';
import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error"
import { loginMutation, loginMutationVariables } from "../__generated__/loginMutation";
import nuberLogo from "../images/logo.svg"
import { Button } from "../components/button";
import { Link } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!){
    login(input:$loginInput){
      ok
      token
      error
    }
  }
`

interface ILoginForm{
  email: string
  password: string
}


export const Login = () => {
  const { 
    register, 
    getValues,
    errors,
    handleSubmit,
    formState
  } = useForm<ILoginForm>({
    mode: "onChange"
  })
  const onCompleted = (data: loginMutation) => {
    const { login: { ok, token } } = data
    if(ok && token){
      console.log(token)
      localStorage.setItem(LOCALSTORAGE_TOKEN, token)
      authTokenVar(token)
      isLoggedInVar(true)
    }
  }
  const [loginMutation, { data:loginMutationResult, loading }] = useMutation<loginMutation, loginMutationVariables>(LOGIN_MUTATION,{
    onCompleted
  })
  const onSubmit = () => {
    if(!loading){
      const { email, password } = getValues()
        loginMutation({
          variables:{
            loginInput:{
              email,
              password
            }
          }
        })
    }
  }

  return (
    <div className="h-screen  flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>
          Login | Nuber Eats
        </title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img alt="" src={nuberLogo} className="w-52 mb-5" />
        <h4 className="w-full font-medium text-left text-3xl">Welcome back</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-1 mt-5 w-full">
          <input 
            ref={register({ 
              required: "Email is required",
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            })}
            name="email"
            type="email"
            placeholder="Email" 
            className="input transition-colors"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          <input 
            ref={register({ required: "Password is required"})}
            name="password"
            type="password"
            placeholder="Password" 
            className="input" 
          />
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          {/* {errors.password?.type === "minLength" && (
            <FormError errorMessage={"Password must be more than 10 chars"} />
          )} */}
            {/* <button className={`btn ${!formState.isValid ? " bg-gray-300 " : ""}`}>
              {loading ? "Loading" : "Log In"}
            </button> */}
            <Button canClick={formState.isValid} loading={loading} actionText={"Log In"}   />
            {loginMutationResult?.login.error && <FormError errorMessage={loginMutationResult.login.error} />}
        </form>
        <div>
          New to Nuber? <Link className="text-lime-600 hover:underline mb-3" to="/create-account">Create An Account</Link>
        </div>
        </div>
      </div>
  )
}