import { User } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export function ProfileButton() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  const handleClick = () => {
    // If user is logged in, redirect to profile page
    // Otherwise, redirect to login page
    if (user) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Button
        size="lg"
        onClick={handleClick}
        disabled={loading}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        title={loading ? 'Loading...' : user ? 'Go to Profile' : 'Sign In'}
      >
        <User className="w-6 h-6 text-white" />
      </Button>
    </motion.div>
  );
}