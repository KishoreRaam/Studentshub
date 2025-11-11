import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import ReactGA from "react-ga4";
import { AnimatePresence } from "framer-motion";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import { SearchProvider } from "./contexts/SearchContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProfileButton } from "./components/ProfileButton";
import Preloader from "./components/Preloader";
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
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  useEffect(() => {
    // Simulate initial loading - adjust timing as needed
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show preloader for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider defaultTheme="system" storageKey="edubuzz-theme">
      <SearchProvider>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <Preloader key="preloader" />
          ) : (
            <div
              key="content"
              className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300"
            >
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
          )}
        </AnimatePresence>
      </SearchProvider>
    </ThemeProvider>
  );
}