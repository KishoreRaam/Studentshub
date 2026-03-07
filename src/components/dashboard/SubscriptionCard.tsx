import { useRef } from "react";
import type { Subscription } from "@/types/dashboard";

type SubscriptionCardProps = {
  subscription: Subscription;
  onRenew: (subscriptionId: string) => void;
  onViewDetails: (subscription: Subscription) => void;
};

const statusConfig = {
  active: {
    label: "Active",
    className: "bg-green-100/70 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  },
  "expiring-soon": {
    label: "Expiring Soon",
    className: "bg-orange-100/70 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400",
  },
  expired: {
    label: "Expired",
    className: "bg-red-100/70 dark:bg-red-900/30 text-red-700 dark:text-red-400",
  },
};

export default function SubscriptionCard({ subscription, onRenew, onViewDetails }: SubscriptionCardProps) {
  const status = statusConfig[subscription.status];
  const isExpiringSoon = subscription.status === "expiring-soon";
  const btnRef = useRef<HTMLButtonElement>(null);

  const handleAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = btnRef.current;
    if (btn) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `width:60px;height:60px;left:${e.clientX - rect.left - 30}px;top:${e.clientY - rect.top - 30}px;background:radial-gradient(circle,rgba(26,86,219,0.3) 0%,transparent 70%);`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    }
    isExpiringSoon ? onRenew(subscription.id) : onViewDetails(subscription);
  };

  return (
    <div className="nm-flat-hover rounded-2xl p-5">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left */}
        <div className="flex items-center gap-4 flex-1">
          <div className="nm-inset w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">{subscription.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{subscription.title}</h3>
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-200/70 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300">
                {subscription.category}
              </span>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${status.className}`}>
                {status.label}
              </span>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
              Expires: {subscription.expiryDate}
            </p>
          </div>
        </div>

        {/* Action button */}
        <button
          ref={btnRef}
          onClick={handleAction}
          className={`nm-btn relative overflow-hidden shrink-0 px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer ${
            isExpiringSoon
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-[#1A56DB] dark:text-blue-400'
          }`}
        >
          {isExpiringSoon ? 'Renew' : 'View Details'}
        </button>
      </div>
    </div>
  );
}
