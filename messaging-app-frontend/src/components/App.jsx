import { useState } from "react";
import "../stylesheets/App.css";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";
import Chatsbar from "./Chatsbar";

function App() {
  const [loginStatus, setLoginStatus] = useState(() => {
    if (localStorage.getItem("Token")) {
      return true;
    } else {
      return false;
    }
  });
  const [chatList, setNewChatList] = useState(false);
  const [url, setUrl] = useState(
    `http://localhost:3000/chat/chatList/${localStorage.getItem("userId")}`,
  );

  return (
    <>
      <Navbar props={{ loginStatus, setLoginStatus, setUrl }} />
      <div className="container">
        <Chatsbar
          loginStatus={loginStatus}
          props={{ chatList, setNewChatList, url, setUrl }}
        />
        <Outlet
          context={[
            loginStatus,
            setLoginStatus,
            chatList,
            setNewChatList,
            url,
            setUrl,
          ]}
        ></Outlet>
      </div>
    </>
  );
}

export default App;
