import type { Stat } from "@/types/dashboard";

type StatsCardProps = {
  stat: Stat;
};

export default function StatsCard({ stat }: StatsCardProps) {
  const Icon = stat.icon;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
            {stat.title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
            {stat.value}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {stat.subtitle}
          </p>
        </div>
        <div className="ml-4 p-3 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-lg shadow-lg">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
