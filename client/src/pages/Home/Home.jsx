import React from "react";
import { useAuth } from "../../context/authContext.jsx";

const Home = () => {
  const { user, setUser } = useAuth();

  return (
    <div>
      <h1>Home Page</h1>
      <h2>User : {user?.username}</h2>
    </div>
  );
};

export default Home;
