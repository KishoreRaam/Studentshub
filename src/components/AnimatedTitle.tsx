import { motion } from 'motion/react';
import { GraduationCap, BookOpen, Pencil } from 'lucide-react';

export function AnimatedTitle() {
  // Animation for blinking eyes
  const blinkAnimation = {
    scaleY: [1, 0.1, 1],
    transition: {
      duration: 0.3,
      repeat: Infinity,
      repeatDelay: 2,
      ease: "easeInOut"
    }
  };

  // Floating animation for decorative elements
  const floatAnimation = {
    y: [-10, 10, -10],
    rotate: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="relative">
      {/* Floating Student Decorations */}
      <motion.div
        animate={floatAnimation}
        className="absolute -top-8 -left-12 text-blue-500 opacity-60"
      >
        <GraduationCap className="w-8 h-8" />
      </motion.div>
      
      <motion.div
        animate={{
          y: [-15, 15, -15],
          rotate: [5, -5, 5],
          transition: {
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }
        }}
        className="absolute -top-6 -right-8 text-green-500 opacity-60"
      >
        <BookOpen className="w-6 h-6" />
      </motion.div>
      
      <motion.div
        animate={{
          y: [-8, 12, -8],
          rotate: [-8, 8, -8],
          transition: {
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }
        }}
        className="absolute top-4 left-1/4 text-purple-500 opacity-50"
      >
        <Pencil className="w-5 h-5" />
      </motion.div>

      {/* More decorative elements */}
      <motion.div
        animate={{
          y: [-12, 8, -12],
          rotate: [3, -3, 3],
          transition: {
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5
          }
        }}
        className="absolute top-8 right-1/4 text-blue-400 opacity-40"
      >
        <div className="w-3 h-3 bg-current rounded-full" />
      </motion.div>

      <motion.div
        animate={{
          y: [-6, 14, -6],
          rotate: [-4, 4, -4],
          transition: {
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }
        }}
        className="absolute -bottom-4 left-8 text-green-400 opacity-50"
      >
        <div className="w-4 h-4 bg-current rounded-full" />
      </motion.div>

      {/* Main Animated Title */}
      <h1 className="text-5xl md:text-7xl text-gray-900 dark:text-white max-w-4xl mx-auto leading-tight relative">
        {/* "Unlock" with animated "o" */}
        <span className="inline-block relative">
          <span>Unl</span>
          <span className="relative inline-block">
            <span className="relative">
              o
              {/* Eyes for the "o" in "Unlock" */}
              <motion.div 
                animate={blinkAnimation}
                className="absolute top-1 left-1/2 transform -translate-x-1/2"
              >
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-700 dark:bg-gray-300 rounded-full" />
                  <div className="w-1 h-1 bg-gray-700 dark:bg-gray-300 rounded-full" />
                </div>
              </motion.div>
            </span>
          </span>
          <span>ck</span>
        </span>

        {' '}
        
        {/* "Your" with animated "ou" - kept together to prevent line break */}
        <span className="inline-block relative">
          <span>Y</span>
          <span className="relative">
            ou
            {/* Eyes for "ou" */}
            <motion.div 
              animate={{
                scaleY: [1, 0.1, 1],
                transition: {
                  duration: 0.3,
                  repeat: Infinity,
                  repeatDelay: 3,
                  ease: "easeInOut",
                  delay: 0.5
                }
              }}
              className="absolute top-1 left-2"
            >
              <div className="flex space-x-2">
                <div className="w-1 h-1 bg-gray-700 dark:bg-gray-300 rounded-full" />
                <div className="w-1 h-1 bg-gray-700 dark:bg-gray-300 rounded-full" />
              </div>
            </motion.div>
          </span>
          <span>r Student</span>
        </span>

        {' '}
        
        {/* "Superpowers" with gradient */}
        <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
          Superpowers
        </span>
        
        {' '}
        
        {/* "Today" */}
        <span>Today</span>

        {/* Additional small floating elements around the text */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.7, 0.3],
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }
          }}
          className="absolute -top-2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full"
        />

        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.6, 0.2],
            transition: {
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }
          }}
          className="absolute bottom-0 right-8 w-1.5 h-1.5 bg-pink-400 rounded-full"
        />
      </h1>
    </div>
  );
}