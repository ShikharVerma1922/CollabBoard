import Login from "./pages/auth/Login.jsx";
import { AuthProvider, useAuth } from "./context/authContext.jsx";
import "./App.css";
import Signup from "./pages/auth/Signup.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./pages/layout/MainLayout.jsx";
import Home from "./pages/home/Home.jsx";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";
import AuthLayout from "./pages/layout/AuthLayout.jsx";
import Features from "./pages/home/Features.jsx";
import Solutions from "./pages/home/Solutions.jsx";
import Resources from "./pages/home/Resources.jsx";
import Nopage from "./pages/home/Nopage.jsx";
import Dashboard from "./pages/app/Dashboard.jsx";
import WorkspacePage from "./pages/app/WorkspacePage.jsx";
import { WorkspaceProvider } from "./context/WorkspaceContext.jsx";
import BoardPage from "./pages/app/BoardPage.jsx";
import MembersPage from "./pages/app/MembersPage.jsx";
import SettingsPage from "./pages/app/SettingsPage.jsx";
import AssignedTasks from "./pages/app/AssignedTasks.jsx";
import { WorkspaceListProvider } from "./context/WorkspaceListContext.jsx";
import { Toaster } from "react-hot-toast";
import ChatModal from "./components/chat/ChatModal.jsx";
import BoardActivitiesPage from "./pages/app/BoardActivitiesPage.jsx";
import Profile from "./pages/app/Profile.jsx";

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
            <Toaster position="top-right" reverseOrder={false} />
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
                  <Route path="tasks" element={<AssignedTasks />} />
                  <Route path="workspace/:id" element={<WorkspacePage />} />
                  <Route
                    path="workspace/:workspaceId/board/:boardId"
                    element={<BoardPage />}
                  />
                  <Route
                    path="workspace/:workspaceId/board/:boardId/activity"
                    element={<BoardActivitiesPage />}
                  />
                  <Route
                    path="workspace/:workspaceId/members"
                    element={<MembersPage />}
                  />
                  <Route path="settings" element={<SettingsPage />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="chat" element={<ChatModal />} />
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
