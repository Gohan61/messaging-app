import { render, screen } from "@testing-library/react";
import App from "../components/App";
import { expect, it } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import Homepage from "../components/Homepage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [{ index: true, element: <Homepage /> }],
  },
]);

describe("App", () => {
  it("renders headline", () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    );
    expect(screen.getByRole("heading").textContent).toMatch(
      /Welcome to the Book Stranger Chat/,
    );
  });

  it("renders signin + signup without login", () => {
    render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>,
    );
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/signin",
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/signup",
    );
  });
});
