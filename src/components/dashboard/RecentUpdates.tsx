import { Bell } from "lucide-react";
import type { Update } from "@/types/dashboard";

type RecentUpdatesProps = {
  updates: Update[];
};

const updateTypeColors = {
  "expiring-soon": {
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  "new-perk": {
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  "renewal-reminder": {
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
  },
  "account-update": {
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
};

export default function RecentUpdates({ updates }: RecentUpdatesProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-gray-700 dark:text-gray-300" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Recent Updates
        </h2>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map((update) => {
          const Icon = update.icon;
          const colors = updateTypeColors[update.type];

          return (
            <div
              key={update.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
            >
              {/* Icon */}
              <div className={`p-2 rounded-lg ${colors.iconBg} flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${colors.iconColor}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {update.title}
                </h4>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1 line-clamp-2">
                  {update.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {update.timestamp}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
