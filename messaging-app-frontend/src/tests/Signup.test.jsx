import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Signup from "../components/Signup";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";

describe("Signup page", () => {
  it("Should display the validation errors", async () => {
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

    await userEvent.type(first_nameInput, " ");
    await userEvent.type(last_nameInput, " ");
    await userEvent.type(usernameInput, " ");
    await userEvent.type(passwordInput, " ");
    await userEvent.type(ageInput, "a");
    await userEvent.type(bioInput, " ");

    await user.click(submitButton);

    expect(
      await screen.findByText("First name must be between 2 and 50 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Last name must be between 2 and 50 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Username must be between 5 and 20 characters"),
    ).toBeInTheDocument();
    expect(
      await screen.findByText("Password must be between 5 and 80 characters"),
    ).toBeInTheDocument();
    expect(await screen.findByText("Age must be a number")).toBeInTheDocument();
    expect(
      await screen.findByText("Bio must be between one and 200 characters"),
    ).toBeInTheDocument();
  });
});

describe("Signin", () => {
  it("Should sign user up without errors", async () => {
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
