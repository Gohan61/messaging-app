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
  const [deleteChat, setDeleteChat] = useState(false);
  return (
    <>
      <Navbar props={{ loginStatus, setLoginStatus }} />
      <div className="container">
        <Chatsbar
          loginStatus={loginStatus}
          props={{ deleteChat, setDeleteChat }}
        />
        <Outlet
          context={[loginStatus, setLoginStatus, deleteChat, setDeleteChat]}
        ></Outlet>
      </div>
    </>
  );
}

export default App;
