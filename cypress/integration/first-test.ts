describe("Log In", () => {
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Nuber Eats")
  })
  it("can fill out the form", () => {
    cy
      .visit("/")
      // .get('[name="email"]')
      .type("test@test.test")
      .get('[name="password"]')
      .type("test")
      .get(".text-lg")
      .should("not.have.class","pointer-events-none")
      //to do (can log in)
  })
  // it("can see email / password validation errors", () => {
  //   cy.visit("/")
  //     .get('[name="email"]')
  //     .type("bad@email")
  //     .get(".text-red-500")
  //     .should("have.text", "Please enter a valid email")
  // })
})