import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { render, RenderResult, wait, waitFor } from "@testing-library/react";
import React from "react"
import { Login } from "../login";
import { HelmetProvider } from "react-helmet-async"
import { BrowserRouter as Router } from "react-router-dom"
import userEvent from "@testing-library/user-event";

describe("<Login />", () => {
  let renderResult:RenderResult 
  beforeEach(async() => {
    await waitFor(async () => {
      const mokedClient = createMockClient()
      renderResult = render(
        <HelmetProvider>
          <Router>
            <ApolloProvider client={mokedClient}>
              <Login />
            </ApolloProvider>
          </Router>
        </HelmetProvider>
      )
    })
  })
  it("should render OK", async() => {
    await waitFor(() => {
      expect(document.title).toBe("Login | Nuber Eats")
    })
  })
  // it("displays email validation erros", async() => {
  //   const { getByPlaceholderText, debug, getByRole } = renderResult
  //   const email = getByPlaceholderText(/email/i)
  //   await waitFor(() => {
  //     userEvent.type(email, "this@wont")
  //   })
  //   let errorMessage = getByRole("alert")
  //   expect(errorMessage).toHaveTextContent(/please enter a valid email/i)
  // })
})