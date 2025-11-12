import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Mail,
  Handshake,
  CreditCard,
  PieChart,
  UserPlus,
  Megaphone,
  Key,
  Copy,
  GraduationCap,
  ExternalLink,
  Target,
  Zap,
  Crown,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const strategies = [
  {
    id: 1,
    title: 'Institutional Email Subscriptions',
    icon: Mail,
    color: 'blue',
    revenue: '₹5-10L / yr',
    bgGradient: 'from-blue-100 to-blue-200',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-500'
  },
  {
    id: 2,
    title: 'Partner Ecosystem (Affiliate)',
    icon: Handshake,
    color: 'green',
    revenue: '₹8-15L / yr',
    bgGradient: 'from-green-100 to-green-200',
    borderColor: 'border-green-200',
    hoverBorder: 'hover:border-green-400',
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-500'
  },
  {
    id: 3,
    title: 'Add-on SaaS Modules (ID, ERP)',
    icon: CreditCard,
    color: 'blue',
    revenue: '₹10-20L / yr',
    bgGradient: 'from-blue-100 to-cyan-200',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-500'
  },
  {
    id: 4,
    title: 'Data Insights (Aggregated Reports)',
    icon: PieChart,
    color: 'purple',
    revenue: '₹15-25L / yr',
    bgGradient: 'from-purple-100 to-purple-200',
    borderColor: 'border-purple-200',
    hoverBorder: 'hover:border-purple-400',
    iconColor: 'text-purple-600',
    badgeBg: 'bg-purple-500'
  },
  {
    id: 5,
    title: 'Recruitment & Internship Platform',
    icon: UserPlus,
    color: 'green',
    revenue: '₹20-35L / yr',
    bgGradient: 'from-green-100 to-emerald-200',
    borderColor: 'border-green-200',
    hoverBorder: 'hover:border-green-400',
    iconColor: 'text-green-600',
    badgeBg: 'bg-green-500'
  },
  {
    id: 6,
    title: 'Campus Marketing / Sponsored Drives',
    icon: Megaphone,
    color: 'orange',
    revenue: '₹12-22L / yr',
    bgGradient: 'from-orange-100 to-orange-200',
    borderColor: 'border-orange-200',
    hoverBorder: 'hover:border-orange-400',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-500'
  },
  {
    id: 7,
    title: 'API for Verification',
    icon: Key,
    color: 'blue',
    revenue: '₹8-15L / yr',
    bgGradient: 'from-blue-100 to-indigo-200',
    borderColor: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconColor: 'text-blue-600',
    badgeBg: 'bg-blue-500'
  },
  {
    id: 8,
    title: 'White-Label Licensing',
    icon: Copy,
    color: 'purple',
    revenue: '₹25-40L / yr',
    bgGradient: 'from-purple-100 to-violet-200',
    borderColor: 'border-purple-200',
    hoverBorder: 'hover:border-purple-400',
    iconColor: 'text-purple-600',
    badgeBg: 'bg-purple-500'
  },
  {
    id: 9,
    title: 'Education & Fintech Collaborations',
    icon: GraduationCap,
    color: 'orange',
    revenue: '₹18-30L / yr',
    bgGradient: 'from-orange-100 to-yellow-200',
    borderColor: 'border-orange-200',
    hoverBorder: 'hover:border-orange-400',
    iconColor: 'text-orange-600',
    badgeBg: 'bg-orange-500'
  }
];

const phases = [
  {
    id: 1,
    title: 'Phase 1: Core Revenue',
    subtitle: 'Foundation Building (Months 0-12)',
    icon: Target,
    bgGradient: 'from-orange-500 to-red-500',
    textColor: 'text-orange-900',
    items: [
      { title: 'Institutional Email Subscriptions', color: 'border-blue-400', iconColor: 'text-blue-600' },
      { title: 'Partner Ecosystem (Affiliate Deals)', color: 'border-green-400', iconColor: 'text-green-600' },
      { title: 'Add-on SaaS Modules', color: 'border-blue-400', iconColor: 'text-blue-600' }
    ]
  },
  {
    id: 2,
    title: 'Phase 2: Scalable Add-ons',
    subtitle: 'Growth Expansion (Months 12-24)',
    icon: Zap,
    bgGradient: 'from-blue-500 to-cyan-500',
    textColor: 'text-blue-900',
    items: [
      { title: 'Data Insights & Reports', color: 'border-purple-400', iconColor: 'text-purple-600' },
      { title: 'Recruitment & Internship Platform', color: 'border-green-400', iconColor: 'text-green-600' },
      { title: 'Campus Marketing Drives', color: 'border-orange-400', iconColor: 'text-orange-600' }
    ]
  },
  {
    id: 3,
    title: 'Phase 3: Ecosystem Monetization',
    subtitle: 'Market Leadership (Months 24+)',
    icon: Crown,
    bgGradient: 'from-green-500 to-emerald-500',
    textColor: 'text-green-900',
    items: [
      { title: 'API for Verification', color: 'border-blue-400', iconColor: 'text-blue-600' },
      { title: 'White-Label Licensing', color: 'border-purple-400', iconColor: 'text-purple-600' },
      { title: 'Education & Fintech Collaborations', color: 'border-orange-400', iconColor: 'text-orange-600' }
    ]
  }
];

export default function AlternativeProfitStrategies() {
  const [hoveredStrategy, setHoveredStrategy] = useState<number | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      className="mb-8"
    >
      <div className="border-4 border-indigo-500 rounded-3xl p-8 bg-white dark:bg-gray-800">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Beyond Core Revenue: The StudentPerks Profit Ecosystem
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Exploring scalable, ethical, and data-driven monetization models
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left: Revenue Diversification Strategies */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Revenue Diversification Strategies
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {strategies.map((strategy, index) => {
                const Icon = strategy.icon;
                return (
                  <motion.div
                    key={strategy.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.7 + index * 0.05 }}
                    className={`p-5 bg-white dark:bg-gray-700 rounded-xl border-2 ${strategy.borderColor} ${strategy.hoverBorder} hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2`}
                    onMouseEnter={() => setHoveredStrategy(strategy.id)}
                    onMouseLeave={() => setHoveredStrategy(null)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`p-3 bg-gradient-to-br ${strategy.bgGradient} rounded-lg mb-3`}>
                        <Icon className={`w-6 h-6 ${strategy.iconColor}`} />
                      </div>
                      <h4 className="text-xs font-medium text-gray-900 dark:text-white mb-2">
                        {strategy.title}
                      </h4>
                      {hoveredStrategy === strategy.id && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`px-3 py-1 ${strategy.badgeBg} text-white text-xs font-semibold rounded-full`}
                        >
                          {strategy.revenue}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Color Legend */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
              className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg"
            >
              <div className="grid grid-cols-4 gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Tech</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Partnerships</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Insights</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Education</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right: Ecosystem Monetization Timeline */}
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
              Ecosystem Monetization Timeline
            </h3>
            <div className="p-8 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-indigo-200 dark:border-indigo-700 rounded-2xl">
              {phases.map((phase, phaseIndex) => {
                const PhaseIcon = phase.icon;
                return (
                  <div key={phase.id}>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: 0.8 + phaseIndex * 0.2 }}
                      className="mb-6"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 bg-gradient-to-br ${phase.bgGradient} rounded-lg`}>
                          <PhaseIcon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className={`font-bold ${phase.textColor} dark:text-white`}>
                            {phase.title}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{phase.subtitle}</p>
                        </div>
                      </div>
                      <div className="pl-6 space-y-2">
                        {phase.items.map((item, itemIndex) => (
                          <motion.div
                            key={itemIndex}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.9 + phaseIndex * 0.2 + itemIndex * 0.1 }}
                            className={`flex items-center gap-2 p-2 bg-white dark:bg-gray-700 rounded-lg border-l-4 ${item.color}`}
                          >
                            <CheckCircle className={`w-4 h-4 ${item.iconColor}`} />
                            <span className="text-xs text-gray-700 dark:text-gray-300">{item.title}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {phaseIndex < phases.length - 1 && (
                      <div className="flex justify-center mb-6">
                        <ArrowRight className="w-6 h-6 text-green-500" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Total Potential */}
              <div className="border-t border-indigo-200 dark:border-indigo-700 my-6 pt-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1.5 }}
                  className="p-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl text-white text-center shadow-lg"
                >
                  <p className="text-sm font-medium mb-2">Total Ecosystem Revenue Potential</p>
                  <div className="text-4xl font-bold mb-1">₹1.2Cr - ₹2.5Cr</div>
                  <p className="text-xs text-green-100">Annual recurring at full scale</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="p-8 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 rounded-2xl text-white shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10 text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Join us in scaling the StudentPerks ecosystem
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Where verified education meets intelligent monetization
            </p>
            <button className="px-8 py-4 bg-white text-blue-600 rounded-xl hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white transition-all duration-300 transform hover:scale-105 shadow-xl flex items-center gap-2 mx-auto group font-semibold">
              <span>Explore Partnership Opportunities</span>
              <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
