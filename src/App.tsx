import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProfileButton } from "./components/ProfileButton";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Perks from "./pages/Perks";
import Login from "./pages/Login/index";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import AITools from "./pages/AITools";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="edubuzz-theme">
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <ScrollToTop />
        <Header />
        <ProfileButton />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/perks" element={<Perks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tools" element={<AITools />} />
        </Routes>

        <Footer />
      </div>
    </ThemeProvider>
  );
}