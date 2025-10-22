import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function AuthButtons() {
  const navigate = useNavigate();
  const [isSignInHovered, setIsSignInHovered] = useState(false);
  const [isSignUpHovered, setIsSignUpHovered] = useState(false);

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