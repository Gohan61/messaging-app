import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const userprop = location.state.userprop;

  return (
    <>
      <div className="profile">
        <h1>
          Profile of: {userprop.first_name} {userprop.last_name}
        </h1>
        <p className="first_name">
          <span>First name:</span> {userprop.first_name}
        </p>
        <p className="last_name">
          <span>Last name:</span> {userprop.last_name}
        </p>
        <p className="username">
          <span>Username:</span> {userprop.username}
        </p>
        <p className="age">
          <span>Age:</span> {userprop.age ? userprop.age : "Not specified"}
        </p>
        <p className="bio">
          <span>Bio:</span> {userprop.bio}
        </p>
      </div>
      <Link to={"/userList"}>Back to users list</Link>
    </>
  );
}
