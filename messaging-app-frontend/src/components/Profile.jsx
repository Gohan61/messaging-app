import { useEffect, useState } from "react";
import he from "he";

export default function Profile() {
  const [user, setUser] = useState(undefined);
  const [url, setUrl] = useState(
    `http://localhost:3000/user/${localStorage.getItem("userId")}`,
  );
  const [error, setError] = useState("");
  const [updateProfile, setUpdateProfile] = useState(false);
  const [updateForm, setUpdateForm] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password: "",
    age: "",
    bio: "",
  });
  const [updateFormerror, setUpdateFormError] = useState([]);

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
          setUpdateForm(res.user);
        } else {
          setError(res.error.message);
        }
      });
  }, [url, updateProfile]);

  function handleSubmit(e) {
    e.preventDefault();

    fetch(`http://localhost:3000/user/${updateForm._id}`, {
      method: "PUT",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("Token"),
      },
      body: JSON.stringify({
        first_name: updateForm.first_name,
        last_name: updateForm.last_name,
        username: updateForm.username,
        password: updateForm.password,
        age: updateForm.age,
        bio: updateForm.bio,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (res.message === "Your profile is updated") {
          setUpdateProfile(false);
        } else if (res.message === "Username already exists") {
          setUpdateFormError(res.message);
        } else {
          throw res.errors;
        }
      })
      .catch((error) => {
        setUpdateFormError(error.errors);
      });
  }
  if (!user) {
    return <p>Loading</p>;
  }
  if (updateProfile) {
    return (
      <div className="updateForm">
        <form action="" method="put" className="signupForm">
          <label htmlFor="first_name">First name: </label>
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={he.decode(updateForm.first_name)}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, first_name: e.target.value })
            }
          />
          <label htmlFor="last_name">Last name: </label>
          <input
            type="text"
            id="last_name"
            name="last_name"
            value={he.decode(updateForm.last_name)}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, last_name: e.target.value })
            }
          />
          <label htmlFor="username">Username: </label>
          <input
            type="text"
            id="username"
            name="username"
            value={he.decode(updateForm.username)}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, username: e.target.value })
            }
          />
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={updateForm.password}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, password: e.target.value })
            }
          />
          <label htmlFor="age">Age: </label>
          <input
            type="number"
            id="age"
            name="age"
            value={updateForm.age}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, age: e.target.value })
            }
          />
          <label htmlFor="bio">Bio: </label>
          <textarea
            type="text"
            id="bio"
            name="bio"
            rows={"8"}
            value={he.decode(updateForm.bio)}
            onChange={(e) =>
              setUpdateForm({ ...updateForm, bio: e.target.value })
            }
          ></textarea>
          <button onClick={(e) => handleSubmit(e)}>Submit</button>
        </form>

        <div className="errors" data-testid="updateFormErrors">
          {typeof updateFormerror === "string" ? (
            <p>{updateFormerror}</p>
          ) : (
            updateFormerror.map((item) => {
              return (
                <p className="error" key={item.path}>
                  {item.msg}
                </p>
              );
            })
          )}
        </div>
      </div>
    );
  } else {
    return (
      <>
        {error ? (
          <p className="error">{error}</p>
        ) : (
          <>
            <div className="profile">
              <h1>
                Your profile: {he.decode(user.first_name)}
                {he.decode(user.last_name)}
              </h1>
              <p className="first_name">
                <span>First name:</span> {he.decode(user.first_name)}
              </p>
              <p className="last_name">
                <span>Last name:</span> {he.decode(user.last_name)}
              </p>
              <p className="username">
                <span>Username:</span> {he.decode(user.username)}
              </p>
              <p className="age">
                <span>Age:</span> {user.age ? user.age : "Not specified"}
              </p>
              <p className="bio">
                <span>Bio:</span> {he.decode(user.bio)}
              </p>
              <button onClick={() => setUpdateProfile(true)}>
                Update profile
              </button>
            </div>
          </>
        )}
      </>
    );
  }
}
