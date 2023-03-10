import { render, waitFor } from "@testing-library/react";
import React from "react";
import { isLoggedInVar } from "../../apollo";
import App from "../app";

jest.mock("../../routers/logged-out-router", () => {
  return {
    LoggedOutRouter: () => <span>logged-out</span>
  }
})

jest.mock("../../routers/logged-in-router", () => {
  return {
    LoggedInRouter: () => <span>logged-in</span>
  }
})

describe("<App />", () => {
  it("renders LoggedOutRouter", () => {
    const { debug, getByText } = render(<App />)
    // debug()
    getByText("logged-out")
  })

  it("renders LoggedInRouter", async() => {
    const { debug, getByText } = render(<App />)
    // debug()
    await waitFor(() => {
      isLoggedInVar(true)
    })
    getByText("logged-in")
  })
})