import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Menu, X, Home, Gift, BarChart3, Settings, Star, Search, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthButtons } from './AuthButtons';
import { ThemeToggle } from './ThemeToggle';
import { GlobalSearchModal } from './search/GlobalSearchModal';
import { Link, useLocation } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileSearchExpanded, setIsMobileSearchExpanded] = useState(false);
  const mobileSearchRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

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
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: BarChart3 },
    { name: 'Perks', path: '/perks', icon: Gift },
    { name: 'Resources', path: '/resources', icon: Star },
    { name: 'Tools', path: '/tools', icon: Settings },
  ];

  return (
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
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-800"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.name}</span>
                </Link>
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
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: (index + 1) * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center space-x-3 py-3 px-4 rounded-lg text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
                      >
                        <Icon className="w-5 h-5" />
                        <span>{link.name}</span>
                      </Link>
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
  );
}