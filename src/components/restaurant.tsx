import React from "react"
import { Link } from "react-router-dom"

interface IRestaurantProps{
  id:string
  coverImg: string
  name: string
  categoryName?:string
}

export const Restaurant: React.FC<IRestaurantProps> = ({ id,coverImg, name, categoryName }) => (
  <Link to={`/restaurants/${id}`}>
    <div className="flex flex-col">
    <div style={{backgroundImage:`url(${coverImg})`}} className="bg-red-500 bg-center bg-cover mb-3 py-32"></div>
    <h3 className="text-lg font-medium">{name}</h3>
    <span className="border-t mt-2 py-2 border-gray-400 text-xs opacity-50">{categoryName}</span>
  </div>
  </Link>
  
)