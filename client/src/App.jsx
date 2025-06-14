import Login from "./pages/auth/Login.jsx";
import { AuthProvider, useAuth } from "./context/authContext.jsx";
import "./App.css";
import Signup from "./pages/auth/Signup.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/Layout/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AuthLayout from "./pages/Layout/AuthLayout.jsx";
import Features from "./pages/Home/Features.jsx";
import Solutions from "./pages/Home/Solutions.jsx";
import Resources from "./pages/Home/Resources.jsx";

function App() {
  const { loadingUser, user } = useAuth();

  if (loadingUser) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<Signup />} />
            <Route path="features" element={<Features />} />
            <Route path="solutions" element={<Solutions />} />
            <Route path="resources" element={<Resources />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
