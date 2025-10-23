import { Sparkles, Users, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

interface AIToolsHeroProps {
  toolsCount: number;
  streamsCount: number;
  usersCount: string;
}

export function AIToolsHero({ toolsCount, streamsCount, usersCount }: AIToolsHeroProps) {
  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-4 py-2 rounded-full mb-4 transition-colors duration-300">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Curated AI Tools</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-300">
            AI Tools for Students
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto transition-colors duration-300">
            Discover powerful AI tools to boost your productivity, enhance learning,
            and unlock your full potential as a student.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {/* Tools Count */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 text-center border border-blue-200 dark:border-blue-800 transition-colors duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-lg mb-3">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              {toolsCount}+
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
              AI Tools
            </div>
          </div>

          {/* Streams Count */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 text-center border border-green-200 dark:border-green-800 transition-colors duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-600 dark:bg-green-500 rounded-lg mb-3">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-1">
              {streamsCount}+
            </div>
            <div className="text-sm text-green-700 dark:text-green-300 font-medium">
              Streams
            </div>
          </div>

          {/* Users Count */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 text-center border border-purple-200 dark:border-purple-800 transition-colors duration-300">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-600 dark:bg-purple-500 rounded-lg mb-3">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-900 dark:text-purple-100 mb-1">
              {usersCount}+
            </div>
            <div className="text-sm text-purple-700 dark:text-purple-300 font-medium">
              Users
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
