import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App.jsx";
import Homepage from "./components/Homepage.jsx";
import Signin from "./components/Signin.jsx";
import Signup from "./components/Signup.jsx";
import "./stylesheets/index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Profile from "./components/Profile.jsx";
import Profiles from "./components/Profiles.jsx";
import Userlist from "./components/Userlist.jsx";
import NewChat from "./components/NewChat.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Homepage /> },
      { path: "signin", element: <Signin /> },
      { path: "signup", element: <Signup /> },
      { path: "profile", element: <Profile /> },
      { path: "userList", element: <Userlist /> },
      { path: "/userList/userProfile", element: <Profiles /> },
      { path: "/:chatId", element: <NewChat /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
