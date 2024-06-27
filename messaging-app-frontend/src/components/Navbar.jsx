import { Link, useNavigate } from "react-router-dom";
import "../stylesheets/Navbar.css";

export default function Navbar({ props }) {
  const navigate = useNavigate();
  return (
    <>
      <nav>
        <a href="/">Book Stranger Chat</a>
        <div className="links">
          {props.loginStatus ? (
            <>
              <button
                onClick={() => {
                  localStorage.removeItem("Token");
                  localStorage.removeItem("username");
                  localStorage.removeItem("userId");
                  props.setLoginStatus(false);
                  navigate("/");
                  props.setUrl("");
                }}
                className="logoutButton"
              >
                Logout
              </button>
              <Link to={"profile"}>Your profile</Link>
              <Link to={"userList"}>All users</Link>
            </>
          ) : (
            <>
              <Link to={"signin"}>Sign in</Link>
              <Link to={"signup"}>Sign up</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
