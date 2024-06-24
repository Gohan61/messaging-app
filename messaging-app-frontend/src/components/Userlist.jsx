import { useEffect, useState } from "react";
import Profiles from "./Profiles";
import { Link } from "react-router-dom";

export default function Userlist() {
  const [url, setUrl] = useState(`http://localhost:3000/user/userlist`);
  const [users, setUsers] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(url, {
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
        if (res.users) {
          setUsers(res.users);
        } else {
          setError(res.error.message);
        }
      });
  }, [url]);

  if (users === "") {
    return <p>Loading</p>;
  } else {
    return (
      <>
        <h1>All users</h1>
        <div className="userList">
          <ul>
            {users.map((user) => {
              return (
                <>
                  <li>
                    <Link to={"userProfile"} state={{ userprop: user }}>
                      {user.username}
                    </Link>
                  </li>
                </>
              );
            })}
          </ul>
        </div>
      </>
    );
  }
}
