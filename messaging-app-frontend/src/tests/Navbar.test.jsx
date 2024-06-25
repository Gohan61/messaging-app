import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import Navbar from "../components/Navbar";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  return {
    _esModule: true,
    ...originalModule,
    Link: "a",
  };
});

describe("Navbar", () => {
  it("Render logout, profile, users but not signin/signout", () => {
    const loginStatus = true;
    const setLoginStatus = () => {};

    render(<Navbar props={{ loginStatus, setLoginStatus }} />);

    expect(screen.queryByText("Sign in")).not.toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("All users")).toBeInTheDocument();
    expect(screen.getByText("Your profile")).toBeInTheDocument();
  });
});
