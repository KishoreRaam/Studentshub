import { motion } from 'motion/react';
import { ClaimedPerk } from '../../types/profile.types';

interface BenefitsGridProps {
  benefits: ClaimedPerk[];
}

export default function BenefitsGrid({ benefits }: BenefitsGridProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      case 'expired':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Available Benefits
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {benefits.map((benefit, index) => (
          <motion.div
            key={benefit.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 * index }}
            className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer group"
          >
            {/* Logo */}
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg group-hover:scale-110 transition-transform duration-200">
              {benefit.perkLogo ? (
                <img
                  src={benefit.perkLogo}
                  alt={benefit.perkName}
                  className="w-8 h-8 object-contain"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md"></div>
              )}
            </div>

            {/* Perk Name */}
            <p className="text-sm font-semibold text-gray-900 dark:text-white text-center mb-2">
              {benefit.perkName}
            </p>

            {/* Status Badge */}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(
                benefit.status
              )}`}
            >
              {benefit.status.charAt(0).toUpperCase() + benefit.status.slice(1)}
            </span>
          </motion.div>
        ))}
      </div>

      {/* View All Benefits Link */}
      <div className="mt-6 text-center">
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200">
          View All Benefits →
        </button>
      </div>
    </motion.div>
  );
}
