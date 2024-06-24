import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState("");
  const [url, setUrl] = useState(
    `http://localhost:3000/user/${localStorage.getItem("userId")}`,
  );
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
        if (res.user) {
          setUser(res.user);
        } else {
          setError(res.error.message);
        }
      });
  }, [url]);

  return (
    <>
      {error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <h1>
            Your profile: {user.first_name} {user.last_name}
          </h1>
          <div className="profile">
            <p className="first_name">
              <span>First name:</span> {user.first_name}
            </p>
            <p className="last_name">
              <span>Last name:</span> {user.last_name}
            </p>
            <p className="username">
              <span>Username:</span> {user.username}
            </p>
            <p className="age">
              <span>Age:</span> {user.age ? user.age : "Not specified"}
            </p>
            <p className="bio">
              <span>Bio:</span> {user.bio}
            </p>
          </div>
        </>
      )}
    </>
  );
}
