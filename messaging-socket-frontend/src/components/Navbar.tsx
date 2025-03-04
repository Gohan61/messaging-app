import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 p-4 flex justify-between md:justify-around lg:px-[calc((100vw-80rem)/2)] mb-2">
      <h1 className="text-white font-bold text-xl">
        <Link to={"/"}>Chat App</Link>
      </h1>
      <div className="text-white text-lg">
        <Link to={"signin"}>Sign in</Link>
        <Link to={"signup"} className="ml-5">
          Sign up
        </Link>
      </div>
    </nav>
  );
}
