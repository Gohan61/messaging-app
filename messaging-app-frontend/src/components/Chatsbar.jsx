import { useState, useEffect } from "react";
import "../stylesheets/Chatsbar.css";
import { Link } from "react-router-dom";

export default function Chatsbar({ loginStatus, props }) {
  const [chats, setChats] = useState([]);
  const [url, setUrl] = useState(
    `http://localhost:3000/chat/chatList/${localStorage.getItem("userId")}`,
  );
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(url, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.chats) {
          setChats(res.chats);
        } else {
          setError(res.error.message);
        }
      });
  }, [url, JSON.stringify(chats), props.deleteChat]);

  if (loginStatus) {
    return (
      <div className="chatsBar">
        <h2>Chats</h2>
        <ul className="chatslist">
          {chats.length > 0
            ? chats.map((chat) => {
                return (
                  <li key={chat._id}>
                    <Link to={`/${chat._id}`}>
                      {localStorage.getItem("userId") !== chat.users[1]
                        ? chat.otherUser
                        : chat.user}
                    </Link>
                  </li>
                );
              })
            : "No Chats"}
        </ul>
        <p className="error">{error}</p>
      </div>
    );
  } else {
    return <h2 className="chatsBarPrompt">Please login to see your chats</h2>;
  }
}
