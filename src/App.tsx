import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { ThemeProvider } from "./components/ThemeProvider";
import { SearchProvider } from "./contexts/SearchContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProfileButton } from "./components/ProfileButton";
import { EmailInquiryWidget } from "./components/EmailInquiryWidget";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Perks from "./pages/Perks";
import Login from "./pages/Login/index";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import VerificationFailed from "./pages/VerificationFailed";
import Profile from "./pages/Profile";
import ResourcesPage from "./pages/ResourcesPage";
import CoursesPage from "./pages/courses";
import AITools from "./pages/AITools";
import BusinessModel from "./pages/BusinessModel";
import CollegePortal from "./pages/CollegePortal";
import MapPage from "./pages/MapPage";
import VendorLanding from "./pages/VendorLanding";

export default function App() {
  const location = useLocation();
  const isMapPage = location.pathname === "/map";
  const isVendorPage = location.pathname === "/vendors";

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="edubuzz-theme">
      <SearchProvider>
        <ScrollToTop />

        {isVendorPage ? (
          <Routes>
            <Route path="/vendors" element={<VendorLanding />} />
          </Routes>
        ) : isMapPage ? (
          <>
            {/* Show main Header on mobile for map page */}
            <div className="md:hidden">
              <Header />
            </div>
            <Routes>
              <Route path="/map" element={<MapPage />} />
            </Routes>
          </>
        ) : (
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
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
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/verification-failed" element={<VerificationFailed />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/tools" element={<AITools />} />
              <Route path="/business-model" element={<BusinessModel />} />
              <Route path="/college-portal" element={<CollegePortal />} />
            </Routes>

            {/* Email Inquiry Widget - appears on all pages */}
            <EmailInquiryWidget />

            <Footer />
          </div>
        )}
      </SearchProvider>
    </ThemeProvider>
  );
}