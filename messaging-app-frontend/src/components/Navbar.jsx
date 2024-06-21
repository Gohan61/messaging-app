import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav>
        <a href="/">Book Stranger Chat</a>
        <Link to={"signin"}>Sign in</Link>
        <Link to={"signup"}>Sign up</Link>
      </nav>
    </>
  );
}
