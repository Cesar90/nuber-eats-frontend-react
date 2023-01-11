import { gql, useApolloClient, useMutation } from "@apollo/client";
import React, {useState, useEffect} from "react";
import { useForm } from "react-hook-form";
import { createRestaurant, createRestaurantVariables } from "../../__generated__/createRestaurant";
import { Button } from "../../components/button";
import {Helmet} from "react-helmet-async"
import { FormError } from "../../components/form-error";
import { MY_RESTAURANTS_QUERY } from "./my-restaurants";
import { useHistory } from "react-router-dom";

export const CREATE_RESTAURANT_MUTATION = gql`
  mutation createRestaurant($input: CreateRestaurantInput!) {
    createRestaurant(input: $input) {
      error
      ok
      restaurantId
    }
  }
`;

interface IFormProps{
  name:string
  address:string
  categoryName:string
  file: FileList
}

interface IRequestImg{
  url: string
}

export const AddRestaurant = () => {
  const client = useApolloClient()
  const history = useHistory();
  const [imageUrl, setImageUrl] = useState("");

  const onCompleted = (data:createRestaurant) => {
    const {createRestaurant: { ok, restaurantId }} = data
    if(ok){
      setUploading(false)
      const { name, categoryName, address } = getValues();
      const queryResult = client.readQuery({ query: MY_RESTAURANTS_QUERY })
      client.writeQuery({
        query: MY_RESTAURANTS_QUERY,
        data: {
          myRestaurants: {
            ...queryResult.myRestaurants,
            restaurants: [
              {
                address,
                category: {
                  name: categoryName,
                  __typename: "Category",
                },
                coverImg: imageUrl,
                id: restaurantId,
                isPromoted: false,
                name,
                __typename: "Restaurant",
              },
              ...queryResult.myRestaurants.restaurants,
            ],
          },
        },
      });
      history.push("/");
    }
  }
  const [createRestaurantMutation, { data }] = useMutation<
    createRestaurant,
    createRestaurantVariables>(CREATE_RESTAURANT_MUTATION,{
      onCompleted,
      // refetchQueries: [{query: MY_RESTAURANTS_QUERY}]
    })

  const { 
    register, 
    getValues, 
    formState, 
    errors, 
    handleSubmit } = useForm<IFormProps>({
      mode:"onChange",
    })
  const [uploading, setUploading] = useState(false)
  const onSubmit = async() => {
    try {
      setUploading(true)
      const { file, name, address, categoryName } = getValues()
      const actualFile = file[0]
      const formBody = new FormData()
      formBody.append("file", actualFile)
      let { url: coverImg } = await (await fetch("http://localhost:4000/uploads/",{
        method: "POST",
        body: formBody
      })).json() as IRequestImg
      setImageUrl(coverImg);
      createRestaurantMutation({
        variables:{
          input:{
            name,
            categoryName,
            address,
            coverImg
          }
        }
      })

      setUploading(false)
    } catch (error) {
      
    }
    
    // const actualFile = file
    // const request = fetch("")
  }
  return (
    <div className="container flex flex-col items-center mt-52">
      <Helmet>
        <title>Add Restaurant | Nuber Eats</title>
      </Helmet>
      <h1>Add Restaurant</h1>
      <form 
       className="grid max-w-screen-sm gap-3 mt-5 w-full mb-5"
      onSubmit={handleSubmit(onSubmit)}>
        <input 
          className="input"
          type="text"
          name="name"
          placeholder="Name" 
          ref={register({required:"Name is required."})} />
        <input 
          className="input"
          type="text"
          name="address"
          placeholder="Address"
          ref={register({required:"Address is required."})} />
        <input
          className="input"
          type="text"
          name="categoryName" 
          placeholder="Category Name"
          ref={register({required:"Category Name is required."})} />
        <div>
          <input 
            type="file" 
            name="file"
            accept="image/*" 
            ref={register({required: true})} />
        </div>
          <Button 
            loading={uploading}
            canClick={formState.isValid}
            actionText={"Create Restaurant"}
          />
          {data?.createRestaurant.error && <FormError 
            errorMessage={data.createRestaurant.error} />}
      </form>
      
    </div>
  )
}