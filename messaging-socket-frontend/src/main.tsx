import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Chat from "./components/Chat";
import Signup from "./components/Signup";
import Signin from "./components/Signin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "chat", element: <Chat /> },
      { path: "signup", element: <Signup /> },
      { path: "signin", element: <Signin /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
