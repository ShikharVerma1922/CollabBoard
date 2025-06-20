import Login from "./pages/Auth/Login.jsx";
import { AuthProvider, useAuth } from "./context/authContext.jsx";
import "./App.css";
import Signup from "./pages/Auth/Signup.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/Layout/MainLayout.jsx";
import Home from "./pages/Home/Home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AuthLayout from "./pages/Layout/AuthLayout.jsx";
import Features from "./pages/Home/Features.jsx";
import Solutions from "./pages/Home/Solutions.jsx";
import Resources from "./pages/Home/Resources.jsx";
import Nopage from "./pages/Home/Nopage.jsx";
import Dashboard from "./pages/App/Dashboard.jsx";
import WorkspacePage from "./pages/App/WorkspacePage.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import BoardPage from "./pages/App/BoardPage.jsx";
import MembersPage from "./pages/App/MembersPage.jsx";
import SettingsPage from "./pages/App/SettingsPage.jsx";
import { WorkspaceListProvider } from "./context/WorkspaceListContext.jsx";

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
        <WorkspaceProvider>
          <WorkspaceListProvider>
            <Routes>
              <Route path="/" element={<AuthLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="signup" element={<Signup />} />
                <Route path="features" element={<Features />} />
                <Route path="solutions" element={<Solutions />} />
                <Route path="resources" element={<Resources />} />
              </Route>

              <Route element={<ProtectedRoute />}>
                <Route path="/app" element={<MainLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="workspace/:id" element={<WorkspacePage />} />
                  <Route
                    path="workspace/:workspaceId/board/:boardId"
                    element={<BoardPage />}
                  />
                  <Route
                    path="workspace/:id/members"
                    element={<MembersPage />}
                  />
                  <Route path="settings" element={<SettingsPage />} />
                </Route>
              </Route>

              <Route path="*" element={<Nopage />} />
            </Routes>
          </WorkspaceListProvider>
        </WorkspaceProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
