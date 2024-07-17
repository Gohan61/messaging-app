import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom";
import he from "he";

export default function NewChat() {
  const { chatId } = useParams();
  const [otherUser, setOtherUser] = useState("");
  const [chat, setChat] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus, chatList, setNewChatList] =
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

    fetch(`https://messaging-app-backend.adaptable.app/chat/${chat._id}`, {
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

    fetch(`https://messaging-app-backend.adaptable.app/chat/${chatId}`, {
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
          if (chatList) {
            setNewChatList(false);
          } else {
            setNewChatList(true);
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
          {he.decode(otherUser.first_name)} {he.decode(otherUser.last_name)}
        </h3>
        <div className="messages">
          {chat.messages.length === 0
            ? "No messages"
            : chat.messages.map((message) => {
                return <p key={message.id}>{he.decode(message.message)}</p>;
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
