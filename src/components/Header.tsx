import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Menu, X, Home, Gift, BarChart3, Settings, Star, Search, BookOpen, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthButtons } from './AuthButtons';
import { ThemeToggle } from './ThemeToggle';
import { GlobalSearchModal } from './search/GlobalSearchModal';
import { OnboardingModal } from './onboarding/OnboardingModal';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useScrollTracking } from '../hooks/useScrollTracking';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Define sections for scroll tracking
  const sections = [
    { id: 'home', path: '/', elementId: 'home' },
    { id: 'benefits', path: '#benefits', elementId: 'benefits' },
    { id: 'dashboard', path: '#dashboard', elementId: 'dashboard' },
  ];

  // Use scroll tracking hook
  const activeSection = useScrollTracking(sections);

  // Auto-close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsMobileSearchExpanded(false);
  }, [location.pathname]);

  // Focus mobile search input when expanded
  useEffect(() => {
    if (isMobileSearchExpanded && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [isMobileSearchExpanded]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home, scrollTo: 'home' },
    { name: 'Benefits', path: '#benefits', icon: Gift, scrollTo: 'benefits' },
    { name: 'Dashboard', path: '#dashboard', icon: BarChart3, scrollTo: 'dashboard' },
    { name: 'Register', path: '/college-portal', icon: BookOpen, isPage: true },
    { name: 'AI Tools', path: '/tools', icon: Star, isPage: true },
  ];

  // Handle navigation with smooth scrolling
  const handleNavClick = (link: typeof navLinks[0]) => {
    if (link.isPage) {
      navigate(link.path);
    } else if (link.scrollTo) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(link.scrollTo!);
          element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      } else {
        const element = document.getElementById(link.scrollTo);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <>
    <header className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-blue-100 dark:border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/b7928a19a6e3cea096b8484c46424ab74db082db.png" 
              alt="EduBuzz Logo" 
              className="h-12 w-auto"
            />
            <span className="ml-3 text-xl text-gray-900 dark:text-gray-100">Edubuzz</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path || activeSection === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => handleNavClick(link)}
                  className="relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-gray-800/50"
                >
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10">{link.name}</span>
                  
                  {/* Three-Layer Lighting Effect */}
                  {isActive && (
                    <>
                      {/* Layer 1: Bottom Line Indicator */}
                      <motion.div
                        layoutId="activeNavLine"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-blue-400 via-green-400 to-blue-400 rounded-full"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                      
                      {/* Layer 2: Animated Glow (Breathing Effect) */}
                      <motion.div
                        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 via-green-400/20 to-blue-400/20 blur-lg"
                        animate={{
                          opacity: [0.3, 0.6, 0.3],
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                      
                      {/* Layer 3: Background Highlight */}
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-blue-900/20 rounded-lg"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    </>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Auth, Theme Toggle, Search and Mobile menu */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Authentication Buttons */}
            <div className="hidden md:flex">
              <AuthButtons />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Desktop Search Button */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open search"
            >
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>

            {/* Mobile Search - Expandable */}
            <div className="md:hidden flex items-center">
              {isMobileSearchExpanded ? (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: '200px', opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <Input
                    ref={mobileSearchRef}
                    type="text"
                    placeholder="Search..."
                    className="h-9 text-sm"
                    onClick={() => {
                      setIsMobileSearchExpanded(false);
                      setIsSearchOpen(true);
                    }}
                    onBlur={() => setIsMobileSearchExpanded(false)}
                  />
                </motion.div>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileSearchExpanded(true)}
                  aria-label="Expand search"
                >
                  <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </Button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4"
            >
              <div className="space-y-2">
                {/* Search button in mobile menu */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    className="flex items-center space-x-3 py-3 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200 w-full"
                  >
                    <Search className="w-5 h-5" />
                    <span>Search</span>
                  </button>
                </motion.div>

                {navLinks.map((link, index) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path || activeSection === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: (index + 1) * 0.1 }}
                    >
                      <button
                        onClick={() => {
                          handleNavClick(link);
                          setIsMenuOpen(false);
                        }}
                        className="relative flex items-center space-x-3 py-3 px-4 rounded-lg transition-all duration-300 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 w-full overflow-hidden"
                      >
                        <Icon className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">{link.name}</span>
                        
                        {/* Three-Layer Lighting Effect for Mobile */}
                        {isActive && (
                          <>
                            {/* Layer 1: Right Side Indicator */}
                            <motion.div
                              layoutId="activeMobileLine"
                              className="absolute right-2 w-1 h-8 bg-gradient-to-b from-blue-400 via-green-400 to-blue-400 rounded-full"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                            
                            {/* Layer 2: Animated Glow */}
                            <motion.div
                              className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-400/20 via-green-400/20 to-blue-400/20 blur-md"
                              animate={{
                                opacity: [0.3, 0.6, 0.3],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            />
                            
                            {/* Layer 3: Background Highlight */}
                            <motion.div
                              layoutId="activeMobileBg"
                              className="absolute inset-0 bg-gradient-to-r from-blue-50 via-green-50 to-blue-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-blue-900/20 rounded-lg"
                              transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            />
                          </>
                        )}
                      </button>
                    </motion.div>
                  );
                })}
                
                {/* Mobile Auth Buttons */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: navLinks.length * 0.1 }}
                  className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4"
                >
                  <AuthButtons />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>

    {/* Start Onboarding - fixed below header, far right */}
    {location.pathname === '/' && (
      <motion.button
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        onClick={() => setIsOnboardingOpen(true)}
        className="fixed top-20 right-8 z-40 text-white font-semibold px-7 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 text-sm whitespace-nowrap"
        style={{ background: 'linear-gradient(135deg, #22c55e, #0ea5e9, #2563eb)' }}
      >
        Start Onboarding
      </motion.button>
    )}

    {/* Onboarding Modal */}
    <OnboardingModal isOpen={isOnboardingOpen} onClose={() => setIsOnboardingOpen(false)} />
    </>
  );
}