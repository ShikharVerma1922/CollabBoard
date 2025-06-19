import React from "react";
import { useAuth } from "../../context/authContext.jsx";

const Home = () => {
  const { user, setUser } = useAuth();

  return (
    <div>
      <h1 className="text-[var(--text)]">Home Page</h1>
      <h2 className="text-[var(--info)]">User : {user?.username}</h2>
      <h2 className="text-[var(--error)]">Some testing text. .... !!</h2>
      <h2 className="text-[var(--warning)]">Some testing text. .... !!</h2>
      <h2 className="text-[var(--success)]">Some testing text. .... !!</h2>
      <h2 className="text-[var(--accent)]">Some testing text. .... !!</h2>
      <h2 className="bg-[var(--surface)]">Some testing text. .... !!</h2>
      <h2 className="bg-[var(--input-bg)]">Some testing text. .... !!</h2>
      <h2 className="bg-[var(--highlight)]">Some testing text. .... !!</h2>
      <div className="bg-[var(--surface)] text-[var(--text)] border border-[var(--border)]">
        <button className="bg-[var(--accent)] hover:bg-[var(--hover)] text-white">
          Create Board
        </button>
      </div>
    </div>
  );
};

export default Home;
