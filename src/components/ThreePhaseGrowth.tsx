import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  TrendingUp,
  Crown,
  Code,
  Target,
  Headphones
} from 'lucide-react';

// Types
interface TeamMember {
  role: string;
  count: number;
  annualCost: string;
}

interface Department {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  members: TeamMember[];
  backgroundColor: string;
  borderColor: string;
  iconColor: string;
}

interface Phase {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  borderColor: string;
  accentColor: string;
  iconBgColor: string;
  iconColor: string;
  departments: Department[];
  monthlyBurn?: string;
  monthlyProfit?: string;
  runway?: string;
}

const phaseData: Phase[] = [
  {
    id: 1,
    title: "Phase 1: Foundation",
    subtitle: "5 Core Members",
    icon: Briefcase,
    borderColor: "border-orange-500",
    accentColor: "bg-orange-500",
    iconBgColor: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
    departments: [
      {
        name: "Leadership",
        icon: Crown,
        backgroundColor: "bg-gray-100 dark:bg-gray-700",
        borderColor: "border-l-gray-400",
        iconColor: "text-gray-600 dark:text-gray-400",
        members: [
          { role: "Founder/CEO", count: 1, annualCost: "₹3L/yr" }
        ]
      },
      {
        name: "Engineering",
        icon: Code,
        backgroundColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-l-orange-500",
        iconColor: "text-orange-600 dark:text-orange-400",
        members: [
          { role: "Full Stack Developers", count: 2, annualCost: "₹8L/yr" }
        ]
      },
      {
        name: "Sales",
        icon: Target,
        backgroundColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-l-green-500",
        iconColor: "text-green-600 dark:text-green-400",
        members: [
          { role: "Sales Representative", count: 1, annualCost: "₹2.5L/yr" }
        ]
      },
      {
        name: "Operations",
        icon: Headphones,
        backgroundColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-l-orange-500",
        iconColor: "text-orange-600 dark:text-orange-400",
        members: [
          { role: "Support Specialist", count: 1, annualCost: "₹2L/yr" }
        ]
      }
    ],
    monthlyBurn: "₹2.25L",
    runway: "13 months (with ₹30L)"
  },
  {
    id: 2,
    title: "Phase 2: Growth",
    subtitle: "12 Members",
    icon: Users,
    borderColor: "border-blue-500",
    accentColor: "bg-blue-500",
    iconBgColor: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
    departments: [
      {
        name: "Leadership",
        icon: Crown,
        backgroundColor: "bg-gray-100 dark:bg-gray-700",
        borderColor: "border-l-gray-400",
        iconColor: "text-gray-600 dark:text-gray-400",
        members: [
          { role: "CEO + CTO", count: 2, annualCost: "₹10L/yr" }
        ]
      },
      {
        name: "Engineering",
        icon: Code,
        backgroundColor: "bg-blue-50 dark:bg-blue-900/20",
        borderColor: "border-l-blue-500",
        iconColor: "text-blue-600 dark:text-blue-400",
        members: [
          { role: "Senior Developer", count: 1, annualCost: "₹10L/yr" },
          { role: "Junior Developers", count: 3, annualCost: "₹15L/yr" }
        ]
      },
      {
        name: "Sales",
        icon: Target,
        backgroundColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-l-green-500",
        iconColor: "text-green-600 dark:text-green-400",
        members: [
          { role: "Sales Lead", count: 1, annualCost: "₹6L/yr" },
          { role: "Sales Representatives", count: 3, annualCost: "₹9L/yr" }
        ]
      },
      {
        name: "Operations",
        icon: Headphones,
        backgroundColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-l-orange-500",
        iconColor: "text-orange-600 dark:text-orange-400",
        members: [
          { role: "Support Team", count: 2, annualCost: "₹6L/yr" }
        ]
      }
    ],
    monthlyBurn: "₹3.83L",
    monthlyProfit: "₹3.67L"
  },
  {
    id: 3,
    title: "Phase 3: Expansion",
    subtitle: "20 Members",
    icon: TrendingUp,
    borderColor: "border-green-500",
    accentColor: "bg-green-500",
    iconBgColor: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
    departments: [
      {
        name: "Leadership",
        icon: Crown,
        backgroundColor: "bg-gray-100 dark:bg-gray-700",
        borderColor: "border-l-gray-400",
        iconColor: "text-gray-600 dark:text-gray-400",
        members: [
          { role: "CEO, CTO, COO", count: 3, annualCost: "₹18L/yr" }
        ]
      },
      {
        name: "Engineering",
        icon: Code,
        backgroundColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-l-green-500",
        iconColor: "text-green-600 dark:text-green-400",
        members: [
          { role: "Senior Developers", count: 2, annualCost: "₹20L/yr" },
          { role: "Junior Developers", count: 4, annualCost: "₹20L/yr" }
        ]
      },
      {
        name: "Sales",
        icon: Target,
        backgroundColor: "bg-green-50 dark:bg-green-900/20",
        borderColor: "border-l-green-500",
        iconColor: "text-green-600 dark:text-green-400",
        members: [
          { role: "Sales Manager", count: 1, annualCost: "₹8L/yr" },
          { role: "Sales Team", count: 6, annualCost: "₹18L/yr" }
        ]
      },
      {
        name: "Operations",
        icon: Headphones,
        backgroundColor: "bg-orange-50 dark:bg-orange-900/20",
        borderColor: "border-l-orange-500",
        iconColor: "text-orange-600 dark:text-orange-400",
        members: [
          { role: "Support Lead", count: 1, annualCost: "₹4L/yr" },
          { role: "Support Team", count: 3, annualCost: "₹9L/yr" }
        ]
      }
    ],
    monthlyBurn: "₹6.42L",
    monthlyProfit: "₹6.67L"
  }
];

export default function ThreePhaseGrowth() {
  return (
    <div className="py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-3">
          Three-Phase Growth Strategy
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl mx-auto">
          Strategic team expansion and financial planning across our growth journey
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {phaseData.map((phase, phaseIndex) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: phaseIndex * 0.1 }}
            className={`border-4 ${phase.borderColor} rounded-2xl bg-white dark:bg-gray-800 overflow-hidden hover:shadow-xl transition-shadow duration-300`}
          >
            {/* Header */}
            <div className={`${phase.accentColor} p-6 text-white`}>
              <div className="flex items-center justify-center mb-4">
                <div className={`w-16 h-16 ${phase.iconBgColor} rounded-full flex items-center justify-center`}>
                  <phase.icon className={`w-8 h-8 ${phase.iconColor}`} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-center mb-2">
                {phase.title}
              </h3>
              <p className="text-center text-white/90 font-medium">
                {phase.subtitle}
              </p>
            </div>

            {/* Departments */}
            <div className="p-4 space-y-3">
              {phase.departments.map((dept, deptIndex) => (
                <motion.div
                  key={deptIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: phaseIndex * 0.1 + deptIndex * 0.05 }}
                  className={`${dept.backgroundColor} ${dept.borderColor} border-l-4 rounded-lg p-4`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <dept.icon className={`w-5 h-5 ${dept.iconColor}`} />
                      <span className="font-semibold text-gray-700 dark:text-gray-200">
                        {dept.name}
                      </span>
                    </div>
                    <span className={`px-2 py-1 ${phase.accentColor} text-white text-xs font-bold rounded-full`}>
                      {dept.members.reduce((sum, m) => sum + m.count, 0)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {dept.members.map((member, memberIndex) => (
                      <div key={memberIndex} className="flex justify-between items-center text-sm">
                        <div className="flex items-center space-x-2">
                          {member.count > 1 && (
                            <span className="text-gray-500 dark:text-gray-400 font-medium">
                              {member.count}×
                            </span>
                          )}
                          <span className="text-gray-600 dark:text-gray-300">
                            {member.role}
                          </span>
                        </div>
                        <span className="text-gray-700 dark:text-gray-200 font-bold">
                          {member.annualCost}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 space-y-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: phaseIndex * 0.1 + 0.3 }}
                className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-3"
              >
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                    Monthly Burn
                  </span>
                  <span className="text-red-600 dark:text-red-400 font-bold text-lg">
                    {phase.monthlyBurn}
                  </span>
                </div>
              </motion.div>

              {phase.runway && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: phaseIndex * 0.1 + 0.35 }}
                  className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                      Runway
                    </span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">
                      {phase.runway}
                    </span>
                  </div>
                </motion.div>
              )}

              {phase.monthlyProfit && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: phaseIndex * 0.1 + 0.35 }}
                  className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-3"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-sm">
                      Monthly Profit
                    </span>
                    <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                      {phase.monthlyProfit}
                    </span>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
