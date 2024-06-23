import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Signin from "../components/Signin";
import Signup from "../components/Signup";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

describe("Signin page errors", () => {
  it("Should display user not found", async () => {
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <Signin />
      </BrowserRouter>,
    );

    const usernameInput = screen.getByLabelText("Username:");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByText("Submit");

    userEvent.type(usernameInput, "aa");
    userEvent.type(passwordInput, "aa");

    await user.click(submitButton);

    expect(await screen.findByText("User not found")).toBeInTheDocument();
  });
});

describe("Signup", () => {
  it("Should sign user up", async () => {
    const user = userEvent.setup();

    render(<Signup />);

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

    render(
      <BrowserRouter>
        <Signin />
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
