/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CreateRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: createRestaurant
// ====================================================

export interface createRestaurant_createRestaurant {
  __typename: "CreateRestauranOutput";
  error: string | null;
  ok: boolean;
  restaurantId: number;
}

export interface createRestaurant {
  createRestaurant: createRestaurant_createRestaurant;
}

export interface createRestaurantVariables {
  input: CreateRestaurantInput;
}
