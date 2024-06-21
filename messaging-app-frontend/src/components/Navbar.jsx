import { Link } from "react-router-dom";
import "../stylesheets/Navbar.css";

export default function Navbar({ props }) {
  return (
    <>
      <nav>
        <a href="/">Book Stranger Chat</a>
        {props.loginStatus ? (
          <button
            onClick={() => {
              localStorage.removeItem("Token");
              localStorage.removeItem("username");
              localStorage.removeItem("userId");
              props.setLoginStatus(false);
            }}
          >
            Logout
          </button>
        ) : (
          <>
            <Link to={"signin"}>Sign in</Link>
            <Link to={"signup"}>Sign up</Link>
          </>
        )}
      </nav>
    </>
  );
}
