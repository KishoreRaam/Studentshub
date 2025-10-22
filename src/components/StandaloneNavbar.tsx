import { useState } from 'react';
import { Button } from './ui/button';
import { Menu, X, ChevronDown, Home, Gift, BarChart3, Mail, User, Settings, HelpCircle, Star, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import edubuzzLogo from 'figma:asset/b7928a19a6e3cea096b8484c46424ab74db082db.png';
import { AuthButtons } from './AuthButtons';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  {
    name: 'Home',
    subItems: [
      { name: 'Dashboard', icon: Home, description: 'Your personal dashboard' },
      { name: 'Profile', icon: User, description: 'Manage your profile' },
      { name: 'Settings', icon: Settings, description: 'Account settings' },
    ]
  },
  {
    name: 'Benefits',
    subItems: [
      { name: 'All Perks', icon: Gift, description: 'View all student benefits' },
      { name: 'Featured', icon: Star, description: 'Top rated benefits' },
      { name: 'Categories', icon: BarChart3, description: 'Browse by category' },
    ]
  },
  {
    name: 'Resources',
    subItems: [
      { name: 'Help Center', icon: HelpCircle, description: 'Get help and support' },
      { name: 'Contact', icon: Mail, description: 'Contact our team' },
    ]
  },
];

export function StandaloneNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src={edubuzzLogo} 
              alt="EduBuzz Logo" 
              className="h-12 w-auto"
            />
            <span className="ml-3 text-xl text-gray-900 dark:text-gray-100">EduBuzz</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="flex items-center space-x-1 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 py-2">
                  <span>{item.name}</span>
                  <motion.div
                    animate={{ rotate: activeDropdown === item.name ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {activeDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-full left-0 mt-2 w-64 z-50"
                    >
                      {/* Glassmorphism Dropdown */}
                      <div className="bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-2 overflow-hidden">
                        {/* Subtle gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-green-50/30 dark:from-blue-900/30 dark:to-green-900/30 rounded-2xl" />
                        
                        {/* Content */}
                        <div className="relative">
                          {item.subItems.map((subItem, index) => {
                            const IconComponent = subItem.icon;
                            return (
                              <motion.a
                                key={subItem.name}
                                href="#"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.15, delay: index * 0.05 }}
                                className="group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/60 dark:hover:bg-gray-800/60 hover:shadow-md"
                              >
                                <div className="flex-shrink-0">
                                  <motion.div
                                    whileHover={{ x: 2, scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                    className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-green-500/10 group-hover:from-blue-500/20 group-hover:to-green-500/20"
                                  >
                                    <IconComponent className="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
                                  </motion.div>
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="text-sm text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                                    {subItem.name}
                                  </div>
                                  <div className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">
                                    {subItem.description}
                                  </div>
                                </div>
                                
                                <motion.div
                                  initial={{ opacity: 0 }}
                                  whileHover={{ opacity: 1, x: 2 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex-shrink-0"
                                >
                                  <ChevronDown className="w-3 h-3 text-gray-400 rotate-[-90deg]" />
                                </motion.div>
                              </motion.a>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* Auth, Theme Toggle, Search and Mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Authentication Buttons */}
            <div className="hidden md:flex">
              <AuthButtons />
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* Search Icon */}
            <Button variant="ghost" size="sm" className="hidden md:flex">
              <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
            
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

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {navItems.map((item) => (
                  <div key={item.name} className="space-y-2">
                    <button 
                      className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.name}</span>
                        <ChevronDown 
                          className={`w-4 h-4 transition-transform ${activeDropdown === item.name ? 'rotate-180' : ''}`} 
                        />
                      </div>
                    </button>
                    
                    {activeDropdown === item.name && (
                      <div className="pl-4 space-y-1">
                        {item.subItems.map((subItem) => {
                          const IconComponent = subItem.icon;
                          return (
                            <a
                              key={subItem.name}
                              href="#"
                              className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                              <IconComponent className="w-4 h-4" />
                              <span>{subItem.name}</span>
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <AuthButtons />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
