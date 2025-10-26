import { motion } from 'motion/react';
import { Bell, Info, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Notification } from '../../types/profile.types';

interface NotificationsCardProps {
  notifications: Notification[];
}

export default function NotificationsCard({ notifications }: NotificationsCardProps) {
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'info':
        return <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      default:
        return <Info className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
      case 'warning':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800';
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600';
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - new Date(date).getTime();
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Notifications
        </h2>
        {notifications.filter((n) => !n.read).length > 0 && (
          <span className="ml-auto px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
            {notifications.filter((n) => !n.read).length}
          </span>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.length > 0 ? (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 * index }}
              className={`p-4 rounded-lg border ${getNotificationColor(
                notification.type
              )} ${!notification.read ? 'ring-2 ring-blue-500/50' : ''}`}
            >
              <div className="flex gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {notification.title}
                    </p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {formatTime(notification.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {notification.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8">
            <Bell className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No new notifications</p>
          </div>
        )}
      </div>

      {/* View All Link */}
      {notifications.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors duration-200">
            View All Notifications
          </button>
        </div>
      )}
    </motion.div>
  );
}
