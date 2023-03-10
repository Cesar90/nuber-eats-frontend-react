import React from "react"
import {Helmet } from "react-helmet-async"
import { gql, useMutation } from '@apollo/client';
import { useForm } from "react-hook-form"
import { FormError } from "../components/form-error"
import { createAccountMutation, createAccountMutationVariables } from "../__generated__/createAccountMutation";
import { UserRole } from "../__generated__/globalTypes";
import nuberLogo from "../images/logo.svg"
import { Button } from "../components/button";
import { Link, useHistory } from "react-router-dom";

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!){
    createAccount(input:$createAccountInput){
      ok
      error
    }
  }
`

interface ICreateAccountForm{
  email: string
  password: string
  role: UserRole
}


export const CreateAccount = () => {
  const { 
    register, 
    getValues,
    watch,
    errors,
    handleSubmit,
    formState
  } = useForm<ICreateAccountForm>({
    mode: "onChange",
    defaultValues:{
      role: UserRole.Client
    }
  })

  const history = useHistory()
  const onCompleted = (data: createAccountMutation) => {
    const { createAccount : { ok }} = data
    if(ok){
      history.push("/")
    }
  }
  const [createAccountMutation, { loading, data: createAccountMutationResult}] = useMutation<createAccountMutation, createAccountMutationVariables>(CREATE_ACCOUNT_MUTATION,{
    onCompleted
  })
  const onSubmit = () => {
    if(!loading){
      const {email, password, role} = getValues()
      createAccountMutation({
        variables:{
          createAccountInput: { email, password, role }
        }
      })
    }
  }
  console.log(watch())
  return (
    <div className="h-screen  flex items-center flex-col mt-10 lg:mt-28">
      <Helmet>
        <title>
          Create Account | Nuber Eats
        </title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img alt="" src={nuberLogo} className="w-52 mb-5" />
        <h4 className="w-full font-medium text-left text-3xl">Let's get started</h4>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-1 mt-5 w-full">
          <input 
            ref={register(
            {
              required: "Email is required",
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            }
            )}
            name="email"
            type="email"
            placeholder="Email" 
            className="input transition-colors"
          />
          {errors.email?.message && <FormError errorMessage={errors.email?.message} />}
          {errors.email?.type === "pattern" && <FormError errorMessage={"Please enter a valid email"} />}
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
          <select name="role" ref={register({ required:true })} className="input">
            {Object.keys(UserRole).map((role, index) => <option key={index}>{role}</option>)}
          </select>
          {/* {errors.password?.type === "minLength" && (
            <FormError errorMessage={"Password must be more than 10 chars"} />
          )} */}
            {/* <button className={`btn ${!formState.isValid ? " bg-gray-300 " : ""}`}>
              {loading ? "Loading" : "Log In"}
            </button> */}
            <Button canClick={formState.isValid} loading={loading} actionText={"Create Account"}   />
            {createAccountMutationResult?.createAccount.error && <FormError errorMessage={createAccountMutationResult.createAccount.error} />}
        </form>
        <div>
          Already have an account? <Link className="text-lime-600 hover:underline mb-5" to="/">Log in now</Link>
        </div>
        </div>
      </div>
  )
}