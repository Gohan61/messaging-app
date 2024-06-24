import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import Profile from "../components/Profile";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import { Outlet } from "react-router-dom";
import { vi } from "vitest";

describe("Signup", () => {
  it("Should sign user up", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Signup />
      </BrowserRouter>,
    );

    const first_nameInput = screen.getByLabelText("First name:");
    const last_nameInput = screen.getByLabelText("Last name:");
    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const ageInput = screen.getByLabelText("Age:");
    const bioInput = screen.getByLabelText("Bio:");
    const submitButton = screen.getByText("Submit");

    await userEvent.type(first_nameInput, "testing");
    await userEvent.type(last_nameInput, "testing");
    await userEvent.type(usernameInput, "testing");
    await userEvent.type(passwordInput, "testing");
    await userEvent.type(ageInput, "12");
    await userEvent.type(
      bioInput,
      "testing the rendering of the page, write some textsadasdasdasdasdasddas",
    );

    await user.click(submitButton);

    expect(await screen.findByTestId("signupErrors")).toBeEmpty();
  });
});

describe("Login", () => {
  it("Should log user in", async () => {
    const user = userEvent.setup();
    const loginStatus = true;
    // const setLoginStatus = () => {};

    vi.mock("react-router-dom", () => ({
      ...vi.importActual("react-router-dom"),
      useOutletContext: () => loginStatus,
    }));

    render(
      <BrowserRouter>
        <Outlet.Provider context={[loginStatus]}>
          <Signin />
        </Outlet.Provider>
      </BrowserRouter>,
    );

    const usernameInputLogin = screen.getByLabelText("Username:");
    const passwordInputLogin = screen.getByLabelText("Password");
    const submitButtonLogin = screen.getByText("Submit");

    await userEvent.type(passwordInputLogin, "testing");
    await userEvent.type(usernameInputLogin, "testing");

    await user.click(submitButtonLogin);

    expect(await screen.findByTestId("errors")).toBeEmpty();
  });
});

describe("Profile information", () => {
  it("Should display user profile information", async () => {
    render(<Profile />);

    expect(
      await screen.findByText("Your profile: testing testing"),
    ).toBeInTheDocument();
  });
});
