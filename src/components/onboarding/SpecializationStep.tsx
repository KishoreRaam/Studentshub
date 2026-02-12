import { motion } from 'motion/react';
import { ArrowLeft } from 'lucide-react';
import { getDepartmentById, getSpecializationsForDepartment } from '../../data/onboardingData';

interface SpecializationStepProps {
  departmentId: string;
  onSelect: (specializationId: string) => void;
  onBack: () => void;
  selectedSpecialization: string | null;
}

export function SpecializationStep({
  departmentId,
  onSelect,
  onBack,
  selectedSpecialization,
}: SpecializationStepProps) {
  const department = getDepartmentById(departmentId);
  const specs = getSpecializationsForDepartment(departmentId);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="px-8 py-10 sm:px-10"
    >
      {/* Department badge */}
      {department && (
        <div className="flex justify-center mb-4">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium">
            <span>{department.icon}</span>
            {department.name}
          </span>
        </div>
      )}

      <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1 text-center">
        Choose Your Specialization
      </h2>
      <p className="text-gray-500 dark:text-gray-400 text-sm text-center mb-6">
        Select your specific area of focus
      </p>

      {/* 3x2 grid - horizontal cards matching Figma */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        {specs.map((spec) => (
          <motion.button
            key={spec.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(spec.id)}
            className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
              selectedSpecialization === spec.id
                ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700/50 hover:border-blue-200 dark:hover:border-blue-500'
            }`}
          >
            {/* Icon square */}
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-600 dark:text-blue-400 text-lg">{spec.icon}</span>
            </div>
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-tight">
              {spec.name}
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
          Back to Departments
        </button>
      </div>
    </motion.div>
  );
}
