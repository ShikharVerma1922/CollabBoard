import { Outlet, Link, NavLink } from "react-router-dom";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { useEffect, useState } from "react";

const AuthLayout = ({ children }) => {
  const [logoSrc, setLogoSrc] = useState("/logo.svg");
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains("dark");
      setLogoSrc(isDark ? "/logo-dark.svg" : "/logo.svg");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Set initial logo
    const isDark = document.documentElement.classList.contains("dark");
    setLogoSrc(isDark ? "/logo-dark.svg" : "/logo.svg");

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <nav
        className={`w-full bg-[var(--bg)] py-3 px-6 transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <ul className="flex space-x-6 font-semibold text-gray-700 dark:text-gray-200">
            <li>
              <Link
                to="/"
                className="text-2xl font-bold text-gray-800 dark:text-gray-100"
              >
                <div className="flex">
                  <img src={logoSrc} alt="CollabBoard logo" className="h-10" />
                  <h1 className="self-center">CollabBoard</h1>
                </div>
              </Link>
            </li>
            <NavLink
              to="/features"
              className={({ isActive }) =>
                `self-center transition ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "hover:text-[var(--accent)]"
                }`
              }
            >
              Features
            </NavLink>
            <li className="self-center">
              <NavLink
                to="/solutions"
                className={({ isActive }) =>
                  `self-center transition ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "hover:text-[var(--accent)]"
                  }`
                }
              >
                Solutions
              </NavLink>
            </li>
            <li className="self-center">
              <NavLink
                to="/resources"
                className={({ isActive }) =>
                  `self-center transition ${
                    isActive
                      ? "text-[var(--accent)]"
                      : "hover:text-[var(--accent)]"
                  }`
                }
              >
                Resources
              </NavLink>
            </li>
          </ul>

          <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            <li>
              <ThemeToggle />
            </li>
            <li className="self-center">
              <Link
                to="/login"
                className="text-[17px] hover:border-b-2 self-center transition"
              >
                Log in
              </Link>
            </li>
            <li className="self-center">
              <Link
                to="/signup"
                className="bg-purple-900 text-white p-2 py-3 rounded hover:bg-purple-950 transition"
              >
                GET STARTED
              </Link>
            </li>
          </ul>
        </div>
      </nav>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
