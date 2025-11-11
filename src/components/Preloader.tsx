import { motion } from "framer-motion";
import { GraduationCap, Sparkles, Gift, BookOpen, Lightbulb } from "lucide-react";

const Preloader = () => {
  const icons = [
    { Icon: GraduationCap, color: "text-blue-500", delay: 0 },
    { Icon: Sparkles, color: "text-yellow-500", delay: 0.2 },
    { Icon: Gift, color: "text-pink-500", delay: 0.4 },
    { Icon: BookOpen, color: "text-green-500", delay: 0.6 },
    { Icon: Lightbulb, color: "text-purple-500", delay: 0.8 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  const iconVariants = {
    hidden: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    visible: {
      scale: [0, 1.2, 1],
      rotate: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const floatVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="relative">
        {/* Background glow effect */}
        <div className="absolute inset-0 blur-3xl opacity-30">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-400 rounded-full"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-400 rounded-full"></div>
          <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-purple-400 rounded-full"></div>
        </div>

        {/* Icons container */}
        <motion.div
          className="relative flex items-center justify-center gap-6 md:gap-8"
          variants={containerVariants}
        >
          {icons.map(({ Icon, color, delay }, index) => (
            <motion.div
              key={index}
              variants={iconVariants}
              custom={delay}
              className="relative"
            >
              <motion.div
                variants={floatVariants}
                animate="animate"
                style={{ animationDelay: `${delay}s` }}
              >
                {/* Icon with glow effect */}
                <div className="relative">
                  <div className={`absolute inset-0 ${color} blur-xl opacity-50`}>
                    <Icon size={48} className="md:w-16 md:h-16" />
                  </div>
                  <Icon
                    size={48}
                    className={`relative ${color} w-12 h-12 md:w-16 md:h-16`}
                    strokeWidth={2}
                  />
                </div>
              </motion.div>

              {/* Progress indicator below each icon */}
              <motion.div
                className="mt-4 h-1 w-12 md:w-16 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay + 0.3 }}
              >
                <motion.div
                  className={`h-full ${color.replace("text-", "bg-")}`}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: delay + 0.5,
                    duration: 0.8,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-600 dark:from-blue-400 dark:to-green-400 bg-clip-text text-transparent">
            StudentsHub
          </h2>
          <motion.p
            className="mt-2 text-sm md:text-base text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.2, duration: 2, repeat: Infinity }}
          >
            Loading your student perks...
          </motion.p>
        </motion.div>

        {/* Animated dots */}
        <motion.div
          className="flex justify-center mt-4 gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Preloader;
