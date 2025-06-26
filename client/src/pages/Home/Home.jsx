import React from "react";
import dashBoardImg from "../../assets/illustration-dashboard2.svg";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 bg-[var(--bg)] text-[var(--text)]">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 items-center py-20">
        <div className="space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Collaborate Smarter with{" "}
            <span className="text-[var(--accent)]">CollabBoard</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Create, manage, and track tasks seamlessly across teams. Your
            all-in-one productivity hub for real-time collaboration, project
            tracking, and more.
          </p>
          <div className="flex gap-4">
            <button className="bg-[var(--accent)] text-white px-6 py-2 rounded hover:brightness-110 transition">
              Get Started
            </button>
            <button className="border border-[var(--accent)] text-[var(--accent)] px-6 py-2 rounded hover:bg-[var(--accent)] hover:text-white transition">
              Learn More
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <img
            src={dashBoardImg}
            alt="CollabBoard illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
