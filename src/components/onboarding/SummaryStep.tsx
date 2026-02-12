import { motion } from 'motion/react';
import { CheckCircle2, Code2, BookOpen, Sparkles, ArrowRight } from 'lucide-react';
import {
  getDepartmentById,
  getSpecializationsForDepartment,
  getSummaryForSpecialization,
} from '../../data/onboardingData';

interface SummaryStepProps {
  departmentId: string;
  specializationId: string;
  onContinue: () => void;
  onEditDepartment: () => void;
}

export function SummaryStep({
  departmentId,
  specializationId,
  onContinue,
  onEditDepartment,
}: SummaryStepProps) {
  const department = getDepartmentById(departmentId);
  const specs = getSpecializationsForDepartment(departmentId);
  const specialization = specs.find((s) => s.id === specializationId);
  const summary = getSummaryForSpecialization(specializationId);

  const cards = [
    {
      title: 'AI Tools',
      icon: Code2,
      description: 'Access cutting-edge AI and productivity tools',
      items: summary.aiTools,
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800/40',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Free Courses',
      icon: BookOpen,
      description: 'Learn from top institutions and platforms',
      items: summary.courses,
      bg: 'bg-green-50 dark:bg-green-900/20',
      iconBg: 'bg-green-100 dark:bg-green-800/40',
      iconColor: 'text-green-600 dark:text-green-400',
    },
    {
      title: 'Perks',
      icon: Sparkles,
      description: 'Exclusive student discounts and benefits',
      items: summary.perks,
      bg: 'bg-pink-50 dark:bg-pink-900/20',
      iconBg: 'bg-pink-100 dark:bg-pink-800/40',
      iconColor: 'text-pink-600 dark:text-pink-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="px-8 py-10 sm:px-10"
    >
      {/* Green checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.15, type: 'spring', damping: 15 }}
        className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center"
      >
        <CheckCircle2 className="w-9 h-9 text-white" />
      </motion.div>

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 text-center">
        Perfect! You're All Set
      </h2>

      {/* Selection badges */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        <span className="text-sm text-gray-500 dark:text-gray-400">You selected:</span>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium bg-white dark:bg-gray-700">
          {department?.name}
        </span>
        <ArrowRight className="w-4 h-4 text-gray-400" />
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-green-200 dark:border-green-700 text-green-700 dark:text-green-300 text-sm font-medium bg-white dark:bg-gray-700">
          {specialization?.name}
        </span>
      </div>

      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
        Here's what you get: AI tools, courses, and perks tailored for your stream.
      </p>

      {/* 3 cards in a row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.bg} rounded-xl p-4`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-8 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                <card.icon className={`w-4 h-4 ${card.iconColor}`} />
              </div>
              <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200">{card.title}</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{card.description}</p>
            <ul className="space-y-1.5">
              {card.items.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Actions - side by side like Figma */}
      <div className="flex gap-3">
        <button
          onClick={onContinue}
          className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold h-12 rounded-xl text-sm transition-all duration-200"
        >
          Continue to Dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onEditDepartment}
          className="px-6 h-12 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          Edit Department
        </button>
      </div>
    </motion.div>
  );
}
