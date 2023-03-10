import { render, waitFor } from "@testing-library/react"
import { HelmetProvider } from "react-helmet-async"
import React from "react"
import { NotFound } from "../404"
import { BrowserRouter as Router} from "react-router-dom"

describe("<NotFound />", () =>{
  it("renders OK", async() => {
    render(
      <HelmetProvider>
        <Router>
          <NotFound />
        </Router>
      </HelmetProvider>
    )
    //Helmet is async therefore 
    await waitFor(() => {
      expect(document.title).toBe("Not Found | Nuber Eats")
    })
    
  })
})