import { useState, useEffect, useRef } from "react";
import type { Stat } from "@/types/dashboard";

type StatsCardProps = { stat: Stat; };

export default function StatsCard({ stat }: StatsCardProps) {
  const Icon = stat.icon;
  const [displayValue, setDisplayValue] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const target = typeof stat.value === 'number' ? stat.value : 0;
    if (hasAnimated.current) { setDisplayValue(target); return; }
    hasAnimated.current = true;
    if (target === 0) { setDisplayValue(0); return; }
    const duration = 900;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [stat.value]);

  const displayText = typeof stat.value === 'string' ? stat.value : displayValue;

  return (
    <div className="nm-flat-hover rounded-2xl p-6">
      <div className="flex items-start gap-4">
        {/* Icon cavity — floats up/down */}
        <div className="nm-inset w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 float-bob">
          <Icon className="w-6 h-6 text-[#1A56DB] dark:text-blue-400" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold tracking-wide text-gray-500 dark:text-gray-400 mb-1 uppercase">
            {stat.title}
          </p>
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 tabular-nums">
            {displayText}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">{stat.subtitle}</p>
        </div>
      </div>
    </div>
  );
}
