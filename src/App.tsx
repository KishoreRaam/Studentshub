import { Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "./components/ThemeProvider";
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
        <Header />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/perks" element={<Perks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/resources" element={<Resources />} />
          <Route path="/tools" element={<AITools />} />
        </Routes>

        <Footer />
      </div>
    </ThemeProvider>
  );
}