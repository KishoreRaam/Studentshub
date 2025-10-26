import { motion } from 'motion/react';
import { UserProfile } from '../../types/profile.types';

interface ProfileHeaderProps {
  user: UserProfile;
}

export default function ProfileHeader({ user }: ProfileHeaderProps) {
  // Generate avatar from initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 mb-6"
    >
      <div className="flex items-center gap-6">
        {/* Avatar */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              getInitials(user.name)
            )}
          </div>
          {/* Active status indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {user.name}
            </h1>
            <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold rounded-full">
              Student
            </span>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-1">
            {user.university}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user.stream}
          </p>
        </div>

        {/* Verification Badge */}
        {user.verificationStatus === 'approved' && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <svg
              className="w-5 h-5 text-green-600 dark:text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-medium text-green-700 dark:text-green-400">
              Verified
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
