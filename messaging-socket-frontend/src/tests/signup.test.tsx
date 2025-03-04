import Signup from "../components/Signup";
import { describe, it, expect, vi, beforeAll } from "vitest";
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

beforeAll(() => {
  try {
    fetch(`http://localhost:3000/signup`, {
      mode: "cors",
      method: `POST`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    });
  } catch (e) {
    console.log(e);
  }
});

describe("Signup Component", () => {
  it("Renders signup components", async () => {
    render(<Signup />);

    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByLabelText("*Username:")).toBeInTheDocument();
    expect(screen.getByLabelText("*Password:")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("Renders empty form validation errors", async () => {
    const user = userEvent.setup();
    render(<Signup />);

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

  it("Renders generic error", async () => {
    const user = userEvent.setup();
    render(<Signup />);

    const usernameInput = screen.getByLabelText("*Username:");
    const passwordInput = screen.getByLabelText("*Password:");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    await act(async () => {
      await userEvent.type(usernameInput, "a".repeat(32));
      await userEvent.type(passwordInput, "a".repeat(55));
      await user.click(submitButton);
    });

    expect(await screen.findByTestId("genericError")).not.toBeEmptyDOMElement();
  });
});
