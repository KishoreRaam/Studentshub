import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { departments } from '../../data/onboardingData';

interface DepartmentStepProps {
  onSelect: (departmentId: string) => void;
  onBack: () => void;
  selectedDepartment: string | null;
}

export function DepartmentStep({ onSelect, onBack, selectedDepartment }: DepartmentStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="px-8 py-10 sm:px-10"
    >
      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1 text-center">
        Choose Your Department
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-8">
        Select your main field of study
      </p>

      {/* 4x2 grid with larger cards matching Figma */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {departments.map((dept) => (
          <motion.button
            key={dept.id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(dept.id)}
            className={`flex flex-col items-center gap-3 p-5 rounded-xl border transition-all duration-200 cursor-pointer ${
              selectedDepartment === dept.id
                ? 'border-blue-500 bg-white dark:bg-blue-900/20 dark:border-blue-400 text-blue-600 dark:text-blue-400'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-500'
            }`}
          >
            {/* Icon in a light colored rounded square */}
            <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-600/50 flex items-center justify-center">
              <span className="text-2xl">{dept.icon}</span>
            </div>
            <span className={`text-xs font-medium text-center leading-tight ${
              selectedDepartment === dept.id
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-200'
            }`}>
              {dept.name}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Back link - centered */}
      <div className="flex justify-center">
        <button
          onClick={onBack}
          className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </button>
      </div>
    </motion.div>
  );
}
