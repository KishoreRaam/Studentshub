import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

interface WelcomeStepProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeStep({ onGetStarted, onSkip }: WelcomeStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="text-center px-8 py-12 sm:px-12"
    >
      {/* Teal gradient circle icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', damping: 15 }}
        className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #0d9488, #2563eb)' }}
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
        Welcome to Student Perks!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm leading-relaxed">
        Pick your department to tailor perks, courses & tools for you.
        We'll customize your dashboard based on your field of study.
      </p>

      {/* Side by side buttons */}
      <div className="flex gap-3 max-w-md mx-auto">
        <button
          onClick={onGetStarted}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold h-12 rounded-xl text-sm transition-all duration-200"
        >
          Get Started
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onSkip}
          className="flex-1 h-12 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Skip for now
        </button>
      </div>
    </motion.div>
  );
}
