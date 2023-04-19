import React from "react";
import jwt from "jsonwebtoken";

const Home = () => {
  const token = localStorage.getItem("token");
  const user = jwt.decode(token);

  return (
    <div>
      <h2>Welcome, {user.name}</h2>
      <p>Email: {user.email}</p>
      <button onClick={() => localStorage.removeItem("token")}>Logout</button>
    </div>
  );
};

export default Home;
