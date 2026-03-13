// Savings Dashboard Widget — styled to match the neumorphic dashboard theme

import { TrendingUp, IndianRupee, Award } from 'lucide-react';
import type { SavingsSummary } from '@/services/perkService';

interface SavingsDashboardWidgetProps {
  savings: SavingsSummary;
  loading?: boolean;
}

export function SavingsDashboardWidget({ savings, loading }: SavingsDashboardWidgetProps) {
  const fmt = (n: number) =>
    n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // When saved_amount was 0 (discount had no ₹ value), show perk count instead
  const noMonetaryValue = savings.total_saved === 0 && savings.total_claimed > 0;

  const stats = [
    {
      icon: IndianRupee,
      label: 'Total Savings',
      value: noMonetaryValue ? 'Tracking' : `₹${fmt(savings.total_saved)}`,
      sub: noMonetaryValue ? 'No ₹ value on claimed perks' : undefined,
      accent: 'text-[#1A56DB] dark:text-blue-400',
      bg: 'from-[#1A56DB]/10 to-[#1A56DB]/5',
      iconColor: 'text-[#1A56DB] dark:text-blue-400',
    },
    {
      icon: TrendingUp,
      label: 'Saved This Month',
      value: noMonetaryValue ? '—' : `₹${fmt(savings.saved_this_month)}`,
      sub: undefined,
      accent: 'text-[#00A63E] dark:text-green-400',
      bg: 'from-[#00A63E]/10 to-[#00A63E]/5',
      iconColor: 'text-[#00A63E] dark:text-green-400',
    },
    {
      icon: Award,
      label: 'Perks Claimed',
      value: String(savings.total_claimed),
      sub: undefined,
      accent: 'text-purple-600 dark:text-purple-400',
      bg: 'from-purple-500/10 to-purple-500/5',
      iconColor: 'text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="nm-flat rounded-2xl p-5 fade-up">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold tracking-widest uppercase text-gray-400 dark:text-gray-500">
          Your Savings
        </p>
        <span className="text-[11px] text-gray-400 dark:text-gray-500 italic">
          Based on perks you confirmed using
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, sub, accent, bg, iconColor }) => (
          <div key={label} className="nm-inset rounded-xl p-4">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-4 h-4 ${iconColor}`} />
            </div>
            <p className={`text-2xl font-bold tracking-tight mb-0.5 ${loading ? 'opacity-30' : accent}`}>
              {loading ? '—' : value}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{label}</p>
            {sub && <p className="text-[10px] text-gray-500 dark:text-gray-600 mt-0.5 leading-tight">{sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
