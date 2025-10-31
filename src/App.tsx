import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import { SearchProvider } from "./contexts/SearchContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProfileButton } from "./components/ProfileButton";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Perks from "./pages/Perks";
import Events from "./pages/Events";
import Login from "./pages/Login/index";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Resources from "./pages/Resources";
import AITools from "./pages/AITools";
import BusinessModel from "./pages/BusinessModel";

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="edubuzz-theme">
      <SearchProvider>
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
            <Route path="/events" element={<Events />} />
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
            <Route path="/business-model" element={<BusinessModel />} />
          </Routes>

          <Footer />
        </div>
      </SearchProvider>
    </ThemeProvider>
  );
}