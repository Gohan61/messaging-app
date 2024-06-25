import { render, screen } from "@testing-library/react";
import App from "../components/App";
import { expect, it, vi } from "vitest";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  return {
    _esModule: true,
    ...originalModule,
    Outlet: vi.fn(),
    Link: "a",
  };
});

describe("App", () => {
  it("renders chats headline", () => {
    render(<App />);
    console.log(screen.getByRole("heading"));
    expect(screen.getByText("Chats")).toBeInTheDocument();
  });

  it("renders signin + signup without login", () => {
    render(<App />);
    expect(screen.getByText("Sign in")).toBeInTheDocument();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
  });
});
