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
  return (
    <>
      <Navbar props={{ loginStatus, setLoginStatus }} />
      <div className="container">
        <Chatsbar
          loginStatus={loginStatus}
          props={{ chatList, setNewChatList }}
        />
        <Outlet
          context={[loginStatus, setLoginStatus, chatList, setNewChatList]}
        ></Outlet>
      </div>
    </>
  );
}

export default App;
