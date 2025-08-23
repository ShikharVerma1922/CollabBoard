import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import dashBoardImg from "../../assets/illustration-dashboard2.svg";
import chatImg from "../../assets/team-chat.png";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Kanban Boards",
    desc: "Organize tasks visually with drag-and-drop columns and cards.",
    icon: "📋",
  },
  {
    title: "Multiple Workspaces",
    desc: "Separate projects and teams for focused collaboration.",
    icon: "🗂️",
  },
  {
    title: "Team Chat",
    desc: "Real-time messaging for instant coordination and updates.",
    icon: "💬",
  },
  {
    title: "Real-Time Sync",
    desc: "Instant updates across all devices and users.",
    icon: "⚡",
  },
  {
    title: "Role-Based Access",
    desc: "Admins, members, and guests for secure project management.",
    icon: "🔒",
  },
  {
    title: "Activity Tracking",
    desc: "See who did what, when, and stay on top of progress.",
    icon: "📈",
  },
];

const solutions = [
  {
    title: "For Teams",
    desc: "Empower your team to collaborate, plan, and execute projects efficiently.",
  },
  {
    title: "Project Management",
    desc: "Track tasks, deadlines, and deliverables with ease.",
  },
  {
    title: "Remote Work",
    desc: "Stay connected and productive from anywhere in the world.",
  },
];

const resources = [
  {
    title: "Documentation",
    link: "#",
  },
  {
    title: "Support",
    link: "#",
  },
  {
    title: "Integrations",
    link: "#",
  },
];

const Home = () => {
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [demoSlide, setDemoSlide] = useState(0);
  return (
    <div className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)]">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-center px-4 sm:px-8 md:px-16 py-20 gap-12 max-w-7xl mx-auto">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Collaborate Smarter with{" "}
            <span className="text-[var(--accent)]">CollabBoard</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Inspired by Trello & Slack, CollabBoard is your all-in-one platform
            for team collaboration, project management, and real-time
            communication.
          </p>
          <div className="flex gap-4">
            <button
              className="bg-[var(--accent)] text-white px-6 py-2 rounded hover:brightness-110 transition shadow-lg cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Get Started
            </button>
            <button
              className="border border-[var(--accent)] text-[var(--accent)] px-6 py-2 rounded hover:bg-[var(--accent)] hover:text-white transition cursor-pointer"
              onClick={() => setShowDemo(true)}
            >
              Demo
            </button>
            {/* Demo Modal - Slideshow (Responsive) */}
            {showDemo && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-full max-w-lg sm:max-w-lg xs:max-w-xs p-4 sm:p-8 relative mx-2">
                  <button
                    className="absolute top-2 right-2 sm:top-4 sm:right-4 text-xl sm:text-2xl text-gray-500 hover:text-[var(--accent)]"
                    onClick={() => setShowDemo(false)}
                    aria-label="Close demo"
                  >
                    &times;
                  </button>
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 text-[var(--accent)] text-center">
                    CollabBoard Demo
                  </h2>
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-full flex flex-col items-center">
                      <div className="text-3xl sm:text-4xl mb-2">
                        {features[demoSlide].icon}
                      </div>
                      <h3 className="font-semibold text-lg sm:text-xl mb-2 text-center">
                        {features[demoSlide].title}
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300 text-center mb-4 text-sm sm:text-base">
                        {features[demoSlide].desc}
                      </p>
                      <div className="w-full flex justify-center mb-2">
                        <span className="inline-block w-40 h-24 sm:w-48 sm:h-28 bg-gray-200 dark:bg-gray-700 rounded shadow"></span>
                      </div>
                      <div className="text-xs text-gray-400 mb-4">
                        [Screenshot placeholder]
                      </div>
                    </div>
                    <div
                      className="relative w-full flex items-center justify-center mt-2"
                      style={{ minHeight: "40px" }}
                    >
                      <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50 flex items-center justify-center"
                        onClick={() => setDemoSlide((s) => Math.max(0, s - 1))}
                        disabled={demoSlide === 0}
                        aria-label="Previous slide"
                        style={{ zIndex: 2 }}
                      >
                        <FaArrowLeft size={24} />
                      </button>
                      <span className="text-sm text-gray-500 mx-10">
                        {demoSlide + 1} / {features.length}
                      </span>
                      <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 px-3 py-2 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold disabled:opacity-50 flex items-center justify-center"
                        onClick={() =>
                          setDemoSlide((s) =>
                            Math.min(features.length - 1, s + 1)
                          )
                        }
                        disabled={demoSlide === features.length - 1}
                        aria-label="Next slide"
                        style={{ zIndex: 2 }}
                      >
                        <FaArrowRight size={24} />
                      </button>
                    </div>
                    <div className="mt-6 text-center">
                      <button
                        className="text-[var(--accent)] underline font-semibold text-base sm:text-lg"
                        onClick={() => {
                          setShowDemo(false);
                          navigate("/signup");
                        }}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <img
            src={dashBoardImg}
            alt="CollabBoard dashboard"
            className="w-full max-w-md rounded-xl shadow-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-16 px-4 sm:px-8 md:px-16 bg-white dark:bg-gray-900"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-[var(--accent)]">
          Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 shadow flex flex-col items-center text-center"
            >
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-xl mb-2">{f.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Solutions Section */}
      <section
        id="solutions"
        className="py-16 px-4 sm:px-8 md:px-16 bg-[var(--bg)]"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-[var(--accent)]">
          Solutions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {solutions.map((s) => (
            <div
              key={s.title}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow text-center"
            >
              <h3 className="font-semibold text-xl mb-2 text-[var(--accent)]">
                {s.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Chat Feature Highlight */}
      <section className="py-16 px-4 sm:px-8 md:px-16 bg-white dark:bg-gray-900 flex flex-col md:flex-row items-center gap-12 max-w-7xl mx-auto">
        <div className="flex-1 flex justify-center mb-8 md:mb-0">
          <img
            src={chatImg}
            alt="CollabBoard chat"
            className="w-full max-w-md rounded-xl shadow-xl"
          />
        </div>
        <div className="flex-1 space-y-6">
          <h2 className="text-3xl font-bold text-[var(--accent)]">Team Chat</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Coordinate instantly with built-in chat. Share updates, files, and
            feedback without leaving your workspace.
          </p>
          <ul className="list-disc ml-6 text-gray-600 dark:text-gray-400">
            <li>Direct & group messaging</li>
            <li>Infinite scroll & message history</li>
            <li>Real-time notifications</li>
          </ul>
        </div>
      </section>

      {/* Resources Section */}
      <section
        id="resources"
        className="py-16 px-4 sm:px-8 md:px-16 bg-[var(--bg)]"
      >
        <h2 className="text-3xl font-bold text-center mb-10 text-[var(--accent)]">
          Resources
        </h2>
        <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
          {resources.map((r) => (
            <a
              key={r.title}
              href={r.link}
              className="bg-white dark:bg-gray-800 rounded-xl px-8 py-4 shadow text-center font-semibold text-[var(--accent)] hover:brightness-110 transition"
            >
              {r.title}
            </a>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 sm:px-8 md:px-16 bg-[var(--accent)] text-white text-center">
        <h2 className="text-3xl font-bold mb-6">
          Ready to boost your team's productivity?
        </h2>
        <p className="mb-8 text-lg">
          Sign up now and start collaborating with CollabBoard!
        </p>
        <button
          className="bg-white text-[var(--accent)] px-8 py-3 rounded font-bold text-lg shadow hover:bg-gray-100 transition cursor-pointer"
          onClick={() => navigate("/signup")}
        >
          Get Started
        </button>
      </section>
    </div>
  );
};

export default Home;
