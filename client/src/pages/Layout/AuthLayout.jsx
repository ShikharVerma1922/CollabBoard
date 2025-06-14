import { Outlet, Link } from "react-router-dom";

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf9] dark:bg-[#1e1e1e]">
      <nav className="w-full bg-[#fcfaf9] dark:bg-[#1e1e1e] py-3 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            <li>
              <Link
                to="/"
                className="text-2xl font-bold text-gray-800 dark:text-gray-100"
              >
                <div className="flex">
                  <img
                    src="/logo-dark.svg"
                    alt="CollabBoard logo"
                    className="h-10"
                  />
                  <h1 className="self-center">CollabBoard</h1>
                </div>
              </Link>
            </li>
            <li className="self-center">
              <Link to="/features">Features</Link>
            </li>
            <li className="self-center">
              <Link to="/solutions">Solutions</Link>
            </li>
            <li className="self-center">
              <Link to="/resources">Resources</Link>
            </li>
          </ul>

          <ul className="flex space-x-6 text-sm font-medium text-gray-700 dark:text-gray-200">
            <li>
              <Link
                to="/login"
                className="text-[17px] hover:border-b-2 transition"
              >
                Log in
              </Link>
            </li>
            <li>
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
