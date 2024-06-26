import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";

export default function NewChat() {
  const { chatId } = useParams();
  const [otherUser, setOtherUser] = useState("");
  const [chat, setChat] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus, deleteChat, setDeleteChat] =
    useOutletContext();

  const fetchMessages = useCallback(() => {
    fetch(`https://messaging-app-backend.adaptable.app/chat/${chatId}`, {
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
        if (res.chat) {
          setChat(res.chat);
          setOtherUser(res.otherUser);
        } else {
          throw res.error;
        }
      })
      .catch((error) => {
        setError(error);
      });
  }, [chatId]);

  useEffect(() => {
    fetchMessages();
  }, [chatId, fetchMessages]);

  function sendMessage(e) {
    e.preventDefault();

    fetch(`https://messaging-app-backend.adaptable.app/${chat._id}`, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        message: message,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.chat) {
          fetchMessages();
          setMessage("");
        } else if (res.message === "Chat not found") {
          setError(res.message);
        } else {
          throw res.errors;
        }
      })
      .catch((error) => {
        setError(error.errors);
      });
  }

  function deleteSubmit(e) {
    e.preventDefault();

    fetch(`https://messaging-app-backend.adaptable.app/${chatId}`, {
      method: "DELETE",
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
        if (res.message === "Chat deleted") {
          if (deleteChat) {
            setDeleteChat(false);
          } else {
            setDeleteChat(true);
          }
          navigate("/");
        } else {
          throw res.error;
        }
      })
      .catch((error) => {
        setError(error);
      });
  }

  if (chat === "") {
    return <p>Loading</p>;
  } else {
    return (
      <div className="chatBox">
        <h3>
          {otherUser.first_name} {otherUser.last_name}
        </h3>
        <div className="messages">
          {chat.messages.length === 0
            ? "No messages"
            : chat.messages.map((message) => {
                return <p key={message.id}>{message.message}</p>;
              })}
        </div>
        <form action="" method="post">
          <label htmlFor="message">New message</label>
          <input
            type="text"
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={(e) => sendMessage(e)}>Send message</button>
        </form>
        <button onClick={() => fetchMessages()}>Check for new message</button>
        <button onClick={(e) => deleteSubmit(e)}>Delete chat</button>
        <p className="error">{error.message}</p>
      </div>
    );
  }
}
