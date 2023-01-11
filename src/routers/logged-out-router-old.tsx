import React from "react"
import { useForm } from "react-hook-form"
// import { isLoggedInVar } from "../apollo"

interface IForm{
  email:string,
  password: string
}

export const LoggedOutRouter = () => {
  const { 
    register, 
    watch, 
    handleSubmit,
    errors } = useForm<IForm>()
  const onSubmit = () => {
    console.log(watch("email"))
  }
  const onInvalid = () =>{
    console.log("Can't create account")
  }
  
  console.log(errors)
  return (
    <div>
      <h1>Logged Out</h1>
      <form onSubmit={handleSubmit(onSubmit,onInvalid)}>
        <div>
          <input
            ref={register({
              required:"This is required",
              // validate: (email:string) => email.includes("@gmail.com")
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/
            })}
            name="email"
            type="email"
            // required
            placeholder="email" />
            {errors.email?.message && (
              <span className="font-bold text-red-600">
                {errors.email?.message}
              </span>
            )}
            {errors.email?.type === "pattern" && (
              <span className="font-bold text-red-600">
                Only gmail allowed
              </span>
            )}
        </div>
        <div>
          <input 
            ref={register({
              required: true
            })}
            name="password"
            type="password"
            // required
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-300 text-white">Submit</button>
      </form>
    </div>
  )
}