import { useState } from "react";

export default function Signup() {
  const [signupForm, setSignupForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    age: "",
    bio: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    fetch("http://localhost:3000/user/signup", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        first_name: signupForm.first_name,
        last_name: signupForm.last_name,
        username: signupForm.username,
        password: signupForm.password,
        age: signupForm.age,
        bio: signupForm.bio,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "You are signed up") {
          console.log(res.message);
        } else if (res.message === "Username already exists") {
          setError(res.message);
        } else {
          throw res.errors;
        }
      })
      .catch((error) => {
        setError(error.errors);
      });
  };

  return (
    <>
      <form action="" method="post" className="signupForm">
        <label htmlFor="first_name">First name: </label>
        <input
          type="text"
          name="first_name"
          id="first_name"
          value={signupForm.first_name}
          onChange={(e) =>
            setSignupForm({ ...signupForm, first_name: e.target.value })
          }
        />
        <label htmlFor="last_name">Last name: </label>
        <input
          type="text"
          id="last_name"
          name="last_name"
          value={signupForm.last_name}
          onChange={(e) =>
            setSignupForm({ ...signupForm, last_name: e.target.value })
          }
        />
        <label htmlFor="username">Username: </label>
        <input
          type="text"
          id="username"
          name="username"
          value={signupForm.username}
          onChange={(e) =>
            setSignupForm({ ...signupForm, username: e.target.value })
          }
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={signupForm.password}
          onChange={(e) =>
            setSignupForm({ ...signupForm, password: e.target.value })
          }
        />
        <label htmlFor="age">Age: </label>
        <input
          type="number"
          id="age"
          name="age"
          value={signupForm.age}
          onChange={(e) =>
            setSignupForm({ ...signupForm, age: e.target.value })
          }
        />
        <label htmlFor="bio">Bio: </label>
        <textarea
          type="text"
          id="bio"
          name="bio"
          value={signupForm.bio}
          onChange={(e) =>
            setSignupForm({ ...signupForm, bio: e.target.value })
          }
        ></textarea>
        <button onClick={(e) => handleSubmit(e)}>Submit</button>
      </form>

      <div className="errors">
        {error.map((item) => {
          return (
            <p className="error" key={item.path}>
              {item.msg}
            </p>
          );
        })}
      </div>
    </>
  );
}