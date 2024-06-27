import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const userprop = location.state.userprop;
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loginStatus, setLoginStatus, chatList, setNewChatList] =
    useOutletContext();

  function newChat(e) {
    e.preventDefault();

    fetch("http://localhost:3000/chat/newchat", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
        otherUserId: userprop._id,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "New chat created") {
          if (chatList) {
            setNewChatList(false);
          } else {
            setNewChatList(true);
          }
          navigate(`/${res.chatId}`);
        } else {
          throw res.error;
        }
      })
      .catch((error) => {
        setError(error);
      });
  }

  return (
    <div className="profile">
      <h1>
        Profile of: {userprop.first_name} {userprop.last_name}
      </h1>
      <p className="first_name">
        <span>First name:</span> {userprop.first_name}
      </p>
      <p className="last_name">
        <span>Last name:</span> {userprop.last_name}
      </p>
      <p className="username">
        <span>Username:</span> {userprop.username}
      </p>
      <p className="age">
        <span>Age:</span> {userprop.age ? userprop.age : "Not specified"}
      </p>
      <p className="bio">
        <span>Bio:</span> {userprop.bio}
      </p>
      <button onClick={(e) => newChat(e)}>Send a message</button>
      <Link to={"/userList"}>Back to users list</Link>
      <p className="error" data-testid="profileError">
        {error.message}
      </p>
    </div>
  );
}
