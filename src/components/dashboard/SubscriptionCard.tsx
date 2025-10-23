import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/types/dashboard";

type SubscriptionCardProps = {
  subscription: Subscription;
  onRenew: (subscriptionId: string) => void;
  onViewDetails: (subscription: Subscription) => void;
};

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-0",
  },
  "expiring-soon": {
    label: "Expiring Soon",
    className: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-0",
  },
  expired: {
    label: "Expired",
    className: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-0",
  },
};

export default function SubscriptionCard({ subscription, onRenew, onViewDetails }: SubscriptionCardProps) {
  const status = statusConfig[subscription.status];
  const isExpiringSoon = subscription.status === "expiring-soon";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left: Icon and Info */}
        <div className="flex items-center gap-4 flex-1">
          <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700 rounded-lg shadow-md flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{subscription.icon}</span>
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {subscription.title}
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-0 text-xs">
                {subscription.category}
              </Badge>
              <Badge className={status.className}>
                {status.label}
              </Badge>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Expires: {subscription.expiryDate}
            </p>
          </div>
        </div>

        {/* Right: Action Button */}
        <div className="w-full sm:w-auto">
          {isExpiringSoon ? (
            <Button
              onClick={() => onRenew(subscription.id)}
              className="w-full sm:w-auto bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 dark:from-cyan-600 dark:to-blue-700 dark:hover:from-cyan-700 dark:hover:to-blue-800 text-white shadow-sm hover:shadow-md transition-all"
            >
              Renew
            </Button>
          ) : (
            <Button
              onClick={() => onViewDetails(subscription)}
              variant="outline"
              className="w-full sm:w-auto border-2 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
