import { render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useLocation } from "react-router-dom";
import Profiles from "../components/Profiles";

vi.mock("react-router-dom", () => {
  const originalModule = vi.importActual("react-router-dom");

  const location = {
    state: {
      userprop: {
        first_name: "testing",
        last_name: "testing",
        username: "peter",
        password: "testing",
        age: 12,
        bio: "testing",
        _id: "667bf638c4bcfb916ad7a472",
      },
    },
  };

  return {
    _esModule: true,
    ...originalModule,
    Link: "a",
    useNavigate: vi.fn(),
    useLocation: () => location,
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

  await fetch("http://localhost:3000/user/signup", {
    mode: "cors",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      first_name: "testing",
      last_name: "testing",
      username: "peter",
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

describe("New chat", () => {
  it("Returns user profile", async () => {
    render(<Profiles />);

    expect(await screen.findByText("peter")).toBeInTheDocument();
  });

  it("Returns recipient user not found", async () => {
    render(<Profiles />);

    const user = userEvent.setup();
    const newChatButton = screen.getByRole("button", {
      name: "Send a message",
    });

    await user.click(newChatButton);

    await waitFor(async () => {
      expect(screen.getByTestId("profileError").textContent).toBe(
        "User not found",
      );
    });
  });
});
