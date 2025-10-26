import { motion } from 'motion/react';
import { Mail, CheckCircle2, Calendar, Link2 } from 'lucide-react';
import { UserProfile } from '../../types/profile.types';

interface AccountInfoCardProps {
  user: UserProfile;
}

export default function AccountInfoCard({ user }: AccountInfoCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  const getProviderIcon = (provider: string) => {
    const icons: Record<string, string> = {
      google: '🔵',
      microsoft: '🟦',
      github: '⚫',
    };
    return icons[provider] || '🔗';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
    >
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        Account Information
      </h2>

      <div className="space-y-5">
        {/* Email Address */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Email Address
            </p>
            <p className="text-gray-900 dark:text-white font-medium">
              {user.email}
            </p>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Account Status
            </p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-900 dark:text-white font-medium capitalize">
                {user.accountStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Validity Period */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
              Validity Period
            </p>
            <p className="text-gray-900 dark:text-white font-medium">
              {formatDate(user.validityPeriod.start)} -{' '}
              {formatDate(user.validityPeriod.end)}
            </p>
          </div>
        </div>

        {/* Linked Accounts */}
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <Link2 className="w-5 h-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
              Linked Accounts
            </p>
            {user.linkedAccounts.length > 0 ? (
              <div className="space-y-2">
                {user.linkedAccounts.map((account) => (
                  <div
                    key={account.provider}
                    className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-md"
                  >
                    <span className="text-xl">{getProviderIcon(account.provider)}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                        {account.provider}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {account.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No accounts linked
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Profile Button */}
      <button className="mt-6 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200">
        Edit Profile
      </button>
    </motion.div>
  );
}
