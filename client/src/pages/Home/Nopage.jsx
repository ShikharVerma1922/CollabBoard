import { Link } from "react-router-dom";

const Nopage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col items-center justify-center px-4">
      <h1 className="text-7xl font-bold text-[var(--accent)]">404</h1>
      <p className="text-xl mt-4 mb-6 text-[var(--muted-text)]">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/app"
        className="px-6 py-2 rounded bg-[var(--accent)] text-white hover:bg-opacity-90 transition"
      >
        Go Home
      </Link>
    </div>
  );
};

export default Nopage;
