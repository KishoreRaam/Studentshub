import { motion } from 'motion/react';
import { Mail, Calendar, Shield } from 'lucide-react';
import { UserProfile } from '../../types/profile.types';
import { useState } from 'react';

interface AccountInfoCardProps {
  user: UserProfile;
  onEditClick?: () => void;
}

export default function AccountInfoCard({ user, onEditClick }: AccountInfoCardProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Account Information
        </h2>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Email Address */}
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Mail className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Email Address
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white truncate">
              {user.email}
            </p>
          </div>
        </div>

        {/* Validity Period */}
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Validity Period
            </p>
            <p className="text-base font-medium text-gray-900 dark:text-white">
              {formatDate(user.validityPeriod.start)} - {formatDate(user.validityPeriod.end)}
            </p>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-start gap-4">
          <div className="mt-1">
            <div className="w-5 h-5 flex items-center justify-center">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Account Status
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Active
            </span>
          </div>
        </div>

        {/* Linked Accounts */}
        {user.linkedAccounts && user.linkedAccounts.length > 0 && (
          <div className="pt-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
              Linked Accounts
            </p>
            <div className="flex flex-wrap gap-2">
              {user.linkedAccounts.map((account) => (
                <span
                  key={account.provider}
                  className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 capitalize"
                >
                  {account.provider}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Profile Button */}
      <div className="px-6 pb-6">
        <button
          onClick={onEditClick}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md"
        >
          Edit Profile
        </button>
      </div>
    </motion.div>
  );
}
