import { motion } from 'motion/react';
import { Clock, ExternalLink } from 'lucide-react';
import { RecentActivity } from '../../types/profile.types';

interface ActivityCardProps {
  activities: RecentActivity[];
  lastLogin: Date;
}

export default function ActivityCard({ activities, lastLogin }: ActivityCardProps) {
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));
    }
  };

  const formatLastLogin = (date: Date) => {
    const now = new Date();
    const loginDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - loginDate.getTime()) / 3600000);

    if (diffInHours < 1) {
      return `Today, ${loginDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    } else if (diffInHours < 24) {
      return `Today, ${loginDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    } else {
      return loginDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Activity & Usage
      </h2>

      <div className="space-y-5">
        {/* Last Login */}
        <div className="pb-5 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last Login
            </p>
          </div>
          <p className="text-gray-900 dark:text-white font-semibold">
            {formatLastLogin(lastLogin)}
          </p>
        </div>

        {/* Recently Accessed */}
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
            Recently Accessed
          </p>
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.05 * index }}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer group"
              >
                {/* Perk Icon */}
                <div className="w-10 h-10 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg shadow-sm">
                  {activity.perkLogo ? (
                    <img
                      src={activity.perkLogo}
                      alt={activity.perkName}
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded"></div>
                  )}
                </div>

                {/* Perk Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {activity.perkName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Accessed {formatTime(activity.accessedAt)}
                  </p>
                </div>

                {/* External Link Icon */}
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200" />
              </motion.div>
            ))}
          </div>

          {/* Pending Verification Note */}
          {activities.some((a) => a.action === 'pending') && (
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                ⚠️ Some benefits are pending verification
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
