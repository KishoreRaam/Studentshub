import { motion } from 'motion/react';
import { TrendingUp } from 'lucide-react';
import { BenefitsStats as BenefitsStatsType } from '../../types/profile.types';

interface BenefitsStatsProps {
  stats: BenefitsStatsType;
}

export default function BenefitsStats({ stats }: BenefitsStatsProps) {
  const percentage = Math.round((stats.activated / stats.total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gradient-to-br from-green-500 to-teal-600 rounded-lg shadow-lg p-8 text-white overflow-hidden relative"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="inline-flex p-3 bg-white/20 rounded-lg mb-4">
          <TrendingUp className="w-6 h-6" />
        </div>

        {/* Main Stats */}
        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-bold">{stats.activated}</span>
            <span className="text-3xl font-semibold text-white/80">
              / {stats.total}
            </span>
          </div>
        </div>

        {/* Label */}
        <p className="text-xl font-semibold mb-2">Benefits Activated</p>

        {/* Available Benefits */}
        <p className="text-white/90 text-sm mb-4">
          {stats.available} more available to claim
        </p>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeOut' }}
            className="h-full bg-white rounded-full"
          ></motion.div>
        </div>
        <p className="text-xs text-white/80 mt-2">{percentage}% Complete</p>
      </div>
    </motion.div>
  );
}
