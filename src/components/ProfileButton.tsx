import { User } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function ProfileButton() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.3 }}
      className="fixed bottom-6 left-6 z-50"
    >
      <Button
        size="lg"
        className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <User className="w-6 h-6 text-white" />
      </Button>
    </motion.div>
  );
}