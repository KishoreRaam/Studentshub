import { Bell } from "lucide-react";
import type { Update } from "@/types/dashboard";

type RecentUpdatesProps = { updates: Update[] };

const updateTypeColors: Record<string, { iconBg: string; iconColor: string }> = {
  "expiring-soon":    { iconBg: "bg-orange-100/70 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400" },
  "new-perk":         { iconBg: "bg-green-100/70 dark:bg-green-900/30",   iconColor: "text-[#00A63E] dark:text-green-400" },
  "renewal-reminder": { iconBg: "bg-orange-100/70 dark:bg-orange-900/30", iconColor: "text-orange-600 dark:text-orange-400" },
  "account-update":   { iconBg: "bg-blue-100/70 dark:bg-blue-900/30",     iconColor: "text-[#1A56DB] dark:text-blue-400" },
};

export default function RecentUpdates({ updates }: RecentUpdatesProps) {
  return (
    <div className="nm-flat rounded-2xl p-6 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="nm-inset w-9 h-9 rounded-xl flex items-center justify-center">
          <Bell className="w-4 h-4 text-[#1A56DB] dark:text-blue-400" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
          Recent Updates
        </h2>
      </div>

      {/* List */}
      <div className="space-y-3">
        {updates.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
            No recent updates
          </p>
        ) : (
          updates.map((update, i) => {
            const Icon = update.icon;
            const colors = updateTypeColors[update.type] ?? updateTypeColors["account-update"];
            return (
              <div key={update.id}>
                <div
                  className="slide-bounce nm-btn flex items-start gap-3 p-3 rounded-xl cursor-pointer"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className={`p-1.5 rounded-lg ${colors.iconBg} flex-shrink-0`}>
                    <Icon className={`w-3.5 h-3.5 ${colors.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5">
                      {update.title}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-0.5">
                      {update.message}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{update.timestamp}</p>
                  </div>
                </div>
                {i < updates.length - 1 && <div className="nm-divider mt-3" />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
