import { render, screen } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import userEvent from "@testing-library/user-event";
import { BrowserRouter, useNavigate, useOutletContext } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { vi } from "vitest";
let token;
let userId;
let username;

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");
  const loginStatus = true;
  const setLoginStatus = () => {};

  return {
    _esModule: true,
    ...originalModule,
    Outlet: vi.fn(),
    Link: "a",
    useNavigate: vi.fn(),
    useOutletContext: () => [loginStatus, setLoginStatus],
  };
});

beforeAll(async () => {
  await fetch("http://localhost:3000/user/signup", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: "testing",
      last_name: "testing",
      username: "testing",
      password: "testing",
      age: 12,
      bio: "testing",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      if (res.message === "You are signed up") {
        console.log("Signup sucess");
      }
    });

  await fetch("http://localhost:3000/user/signin", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: "testing",
      password: "testing",
    }),
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      localStorage.setItem("Token", `Bearer ${res.token}`);
      localStorage.setItem("userId", res.userId);
      localStorage.setItem("username", res.username);
    });
});

describe("Profile information", () => {
  it("Should display user profile information", async () => {
    render(<Profile />);

    expect(
      await screen.findByText("Your profile: testing testing"),
    ).toBeInTheDocument();
    expect(await screen.findByText(12)).toBeInTheDocument();
  });
});

describe("Update profile", () => {
  it("Should update profile information", async () => {
    const user = userEvent.setup();

    render(<Profile />);

    const updateButton = screen.getByRole("button", {
      name: "Update profile",
    });

    await user.click(updateButton);

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const ageInput = screen.getByLabelText("Age:");
    const bioInput = screen.getByLabelText("Bio:");

    // Tests somehow skip the first clear method
    // resulting in the first input not to be cleared
    // That is why clear method is repeated for first_nameInput
    await userEvent.clear(first_nameInput);
    await userEvent.clear(first_nameInput);
    await userEvent.clear(last_nameInput);
    await userEvent.clear(usernameInput);
    await userEvent.clear(passwordInput);
    await userEvent.clear(ageInput);
    await userEvent.clear(bioInput);

    await userEvent.type(first_nameInput, "Hans");
    await userEvent.type(last_nameInput, "Testing");
    await userEvent.type(usernameInput, "Testing");
    await userEvent.type(passwordInput, "testing");
    await userEvent.type(ageInput, "12");
    await userEvent.type(bioInput, "Testing testing testing testing testing");

    const submitButton = screen.getByRole("button", { name: "Submit" });
    await user.click(submitButton);

    render(<Profile />);

    expect(await screen.findByText("12")).toBeInTheDocument();
    expect(await screen.findByText("Hans")).toBeInTheDocument();
  });
});
