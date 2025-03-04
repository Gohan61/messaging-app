import Signin from "../components/Signin";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { act } from "react";
import userEvent from "@testing-library/user-event";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  return {
    _esModuel: true,
    ...originalModule,
    useNavigate: vi.fn(),
  };
});

describe("Signin Component", () => {
  it("Renders sign in components", async () => {
    render(<Signin />);

    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByLabelText("Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("Renders empty form validation errors", async () => {
    const user = userEvent.setup();
    render(<Signin />);

    const submitButton = screen.getByRole("button", { name: "Submit" });

    await act(async () => {
      await user.click(submitButton);
    });

    expect(
      await screen.findByTestId("usernameError")
    ).not.toBeEmptyDOMElement();
    expect(
      await screen.findByTestId("passwordError")
    ).not.toBeEmptyDOMElement();
  });

  it("Renders generic errors", async () => {
    const user = userEvent.setup();
    render(<Signin />);

    const usernameField = screen.getByLabelText("Username:");
    const passwordField = screen.getByLabelText("Password:");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await act(async () => {
      await userEvent.type(usernameField, "nonExistingUser");
      await userEvent.type(passwordField, "nonExistingUser");
      await user.click(submitButton);
    });

    expect(await screen.findByTestId("genericError")).not.toBeEmptyDOMElement();
  });
});
