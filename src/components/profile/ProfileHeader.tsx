import { motion } from 'motion/react';
import { UserProfile } from '../../types/profile.types';
import { getStreamLabel } from '../../utils/streamUtils';

interface ProfileHeaderProps {
  user: UserProfile;
  onEditClick?: () => void;
}

export default function ProfileHeader({ user, onEditClick }: ProfileHeaderProps) {
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
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl shadow-sm p-8 mb-6 mt-4 border border-blue-100 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        {/* Avatar */}
        <div className="relative group flex-shrink-0">
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-blue-500 to-green-500 p-[3px] shadow-lg">
            <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-blue-600 to-green-600 bg-clip-text text-transparent">
                  {getInitials(user.name)}
                </span>
              )}
            </div>
          </div>
          {/* Active status indicator */}
          <div className="absolute bottom-0 right-0 w-7 h-7 md:w-8 md:h-8 bg-green-500 border-4 border-white dark:border-gray-800 rounded-full shadow-md"></div>
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 drop-shadow-sm">
            {user.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
            <span className="px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-full shadow-sm">
              Student
            </span>
            {user.verificationStatus === 'approved' && (
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm font-semibold rounded-full">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified
              </span>
            )}
          </div>
          <p className="text-lg font-semibold text-gray-800 dark:text-gray-100 drop-shadow-sm">
            {user.university}
          </p>
          {user.stream && (
            <p className="text-sm font-medium text-gray-700 dark:text-gray-200 mt-1.5">
              {getStreamLabel(user.stream)}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
