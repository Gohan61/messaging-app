import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import { vi } from "vitest";
import Chatsbar from "../components/Chatsbar";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  return {
    _esModule: true,
    ...originalModule,
    Link: "a",
  };
});

describe("Chatbar", () => {
  it("Displays login prompt to user", () => {
    render(<Chatsbar />);

    expect(
      screen.getByText("Please login to see your chats"),
    ).toBeInTheDocument();
  });

  it("Display chat bar to logged in user", async () => {
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

    await waitFor(async () => {
      const loginStatus = true;
      render(<Chatsbar loginStatus={loginStatus} />);
      expect(await screen.findByText("Chats")).toBeInTheDocument();
    });
  });
});
