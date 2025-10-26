import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export function AuthButtons() {
  const navigate = useNavigate();
  const { user, logout, loading } = useAuth();
  const [isSignInHovered, setIsSignInHovered] = useState(false);
  const [isSignUpHovered, setIsSignUpHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [isLogoutHovered, setIsLogoutHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center space-x-3">
        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded"></div>
      </div>
    );
  }

  // Show user menu when logged in
  if (user) {
    return (
      <div className="flex items-center space-x-3">
        {/* Profile Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsProfileHovered(true)}
          onHoverEnd={() => setIsProfileHovered(false)}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/profile')}
            className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <motion.div
              animate={{ x: isProfileHovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <User className="w-4 h-4 mr-2" />
            </motion.div>
            {user.name || 'Profile'}
          </Button>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onHoverStart={() => setIsLogoutHovered(true)}
          onHoverEnd={() => setIsLogoutHovered(false)}
        >
          <Button
            size="sm"
            onClick={handleLogout}
            className="gradient-primary hover:gradient-primary-hover btn-float text-white border-0 shadow-lg hover:shadow-xl"
          >
            <motion.div
              animate={{ x: isLogoutHovered ? 2 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <LogOut className="w-4 h-4 mr-2" />
            </motion.div>
            Logout
          </Button>
        </motion.div>
      </div>
    );
  }

  // Show Sign In/Sign Up buttons when not logged in
  return (
    <div className="flex items-center space-x-3">
      {/* Sign In Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsSignInHovered(true)}
        onHoverEnd={() => setIsSignInHovered(false)}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/login')}
          className="text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all duration-200"
        >
          <motion.div
            animate={{ x: isSignInHovered ? 2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <LogIn className="w-4 h-4 mr-2" />
          </motion.div>
          Sign In
        </Button>
      </motion.div>

      {/* Sign Up Button */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsSignUpHovered(true)}
        onHoverEnd={() => setIsSignUpHovered(false)}
      >
        <Button
          size="sm"
          onClick={() => navigate('/signup')}
          className="gradient-primary hover:gradient-primary-hover btn-float text-white border-0 shadow-lg hover:shadow-xl"
        >
          <motion.div
            animate={{ x: isSignUpHovered ? 2 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <UserPlus className="w-4 h-4 mr-2" />
          </motion.div>
          Sign Up
        </Button>
      </motion.div>
    </div>
  );
}