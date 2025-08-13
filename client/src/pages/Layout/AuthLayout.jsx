import { Outlet, Link, NavLink } from "react-router-dom";
import ThemeToggle from "../../components/theme/ThemeToggle";
import { useEffect, useState } from "react";

const AuthLayout = ({ children }) => {
  const [logoSrc, setLogoSrc] = useState("/logo.svg");
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false); // Mobile menu state
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

  // Close menu on route change
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)]">
      <nav
        className={`w-full bg-[var(--bg)] py-3 px-6 transition-shadow ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          {/* Logo and Hamburger */}
          <div className="flex gap-8 justify-between items-center w-full md:w-fit">
            <div className="flex items-center justify-between md:justify-start w-full">
              <Link
                to="/"
                className="text-2xl font-bold text-gray-800 dark:text-gray-100"
              >
                <div className="flex">
                  <img src={logoSrc} alt="CollabBoard logo" className="h-10" />
                  <h1 className="self-center">CollabBoard</h1>
                </div>
              </Link>
              <div className="flex gap-3 md:hidden">
                <span className="flex gap-2 text-[var(--text)]">
                  <ThemeToggle />
                </span>

                {/* Hamburger for mobile */}
                <button
                  className="ml-4 flex flex-col justify-center items-center md:hidden focus:outline-none"
                  aria-label="Toggle menu"
                  onClick={() => setMenuOpen((prev) => !prev)}
                >
                  <span
                    className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1 transition-transform ${
                      menuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 mb-1 transition-opacity ${
                      menuOpen ? "opacity-0" : ""
                    }`}
                  ></span>
                  <span
                    className={`block w-6 h-0.5 bg-gray-700 dark:bg-gray-200 transition-transform ${
                      menuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                  ></span>
                </button>
              </div>
            </div>

            {/* Desktop Nav */}
            <ul className="hidden md:flex space-x-6 font-semibold text-gray-700 dark:text-gray-200">
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
          </div>

          {/* Desktop Right Side */}
          <ul className="hidden md:flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            <li>
              <ThemeToggle />
            </li>
            <li className="self-center">
              <Link
                to="/login"
                className="text-[17px] hover:border-b-2 self-center transition text-nowrap"
              >
                Log in
              </Link>
            </li>
            <li className="self-center">
              <Link
                to="/signup"
                className="bg-purple-900 text-white p-2 py-3 rounded hover:bg-purple-950 transition min-w-fit text-nowrap"
              >
                GET STARTED
              </Link>
            </li>
          </ul>

          {/* Mobile Menu */}
          {menuOpen && (
            <div className="absolute top-full left-0 w-full bg-[var(--bg)] shadow-2xl z-50 md:hidden animate-fade-in flex flex-col justify-center items-center text-2xl">
              <ul className="flex flex-col space-y-2 py-4 px-6 font-semibold text-gray-700 dark:text-gray-200">
                <NavLink
                  to="/features"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "hover:text-[var(--accent)]"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Features
                </NavLink>
                <NavLink
                  to="/solutions"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "hover:text-[var(--accent)]"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Solutions
                </NavLink>
                <NavLink
                  to="/resources"
                  className={({ isActive }) =>
                    `transition ${
                      isActive
                        ? "text-[var(--accent)]"
                        : "hover:text-[var(--accent)]"
                    }`
                  }
                  onClick={() => setMenuOpen(false)}
                >
                  Resources
                </NavLink>
                <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>
                <li className="text-center">
                  <Link
                    to="/login"
                    className="hover:border-b-2 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Log in
                  </Link>
                </li>
                <li className="text-center">
                  <Link
                    to="/signup"
                    className="hover:border-b-2 transition"
                    onClick={() => setMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
