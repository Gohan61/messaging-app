import { useNavigate, useOutletContext } from "react-router-dom";
import { useState } from "react";

export default function Signin() {
  const [signupForm, setSignupForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus, chatList, setNewChatList, url, setUrl] =
    useOutletContext();

  const fetchToken = (event) => {
    event.preventDefault();

    fetch("https://messaging-app-backend.adaptable.app/user/signin", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signupForm.username,
        password: signupForm.password,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.token !== undefined) {
          localStorage.setItem("Token", `Bearer ${res.token}`);
          localStorage.setItem("userId", res.userId);
          localStorage.setItem("username", res.username);
          setLoginStatus(true);
          setUrl(
            `https://messaging-app-backend.adaptable.app/chat/chatList/${localStorage.getItem("userId")}`,
          );
          navigate("/");
        } else {
          throw res.error;
        }
      })
      .catch((err) => {
        setError(err);
      });
  };

  return (
    <div className="signin">
      <form action="" method="post" className="signinForm">
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          name="username"
          id="username"
          value={signupForm.username}
          onChange={(e) =>
            setSignupForm({ ...signupForm, username: e.target.value })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          value={signupForm.password}
          onChange={(e) =>
            setSignupForm({ ...signupForm, password: e.target.value })
          }
        />
        <button onClick={(e) => fetchToken(e)}>Submit</button>
      </form>
      <p className="error" data-testid="errors">
        {error}
      </p>
    </div>
  );
}
