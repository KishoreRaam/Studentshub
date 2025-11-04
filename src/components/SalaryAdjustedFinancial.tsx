import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

interface ExpenseItem {
  label: string;
  amount: string;
  percentage: number;
  description?: string;
}

const expenseData: ExpenseItem[] = [
  {
    label: 'Salaries',
    amount: '₹9L',
    percentage: 34,
    description: 'Team compensation costs'
  },
  {
    label: 'Platform Development',
    amount: '₹5L',
    percentage: 19
  },
  {
    label: 'Marketing & Sales',
    amount: '₹4L',
    percentage: 15
  },
  {
    label: 'Operations',
    amount: '₹3.2L',
    percentage: 12
  },
  {
    label: 'Support & Maintenance',
    amount: '₹3L',
    percentage: 11
  },
  {
    label: 'Miscellaneous',
    amount: '₹2L',
    percentage: 8
  }
];

export default function SalaryAdjustedFinancial() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="mb-8"
    >
      <div className="border-4 border-purple-500 rounded-3xl p-8 bg-white dark:bg-gray-800">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center">
            <Users className="w-7 h-7 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
            Salary-Adjusted Financial Projection
          </h2>
        </div>

        {/* Two Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Revised Expense Breakdown */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Revised Expense Breakdown
            </h3>

            <div className="space-y-4">
              {expenseData.map((expense, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  className="bg-orange-50/50 dark:bg-orange-900/10 rounded-xl p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="text-gray-700 dark:text-gray-300 font-medium text-base">
                        {expense.label}
                      </span>
                      {expense.description && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {expense.description}
                        </p>
                      )}
                    </div>
                    <span className="text-gray-800 dark:text-gray-200 font-bold text-lg">
                      {expense.amount}
                    </span>
                  </div>
                  <div className="w-full bg-orange-200/50 dark:bg-orange-900/30 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-orange-600 to-orange-400 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${expense.percentage}%` }}
                    ></div>
                  </div>
                </motion.div>
              ))}

              {/* Total Expenses */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-5 mt-4"
              >
                <div className="flex justify-between items-center">
                  <span className="text-orange-900 dark:text-orange-200 font-bold text-xl">
                    Total Expenses
                  </span>
                  <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                    ₹26.2L
                  </span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Right: Net Profit after Salaries */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6">
              Net Profit after Salaries
            </h3>

            <div className="space-y-4">
              {/* Adjusted Net Profit Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20 border-2 border-cyan-300 dark:border-cyan-700 rounded-2xl p-6"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                  Adjusted Net Profit
                </p>
                <p className="text-5xl font-bold text-cyan-700 dark:text-cyan-400 mb-2">
                  ₹3.8L
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  After all expenses including salaries
                </p>
              </motion.div>

              {/* Adjusted Profit Margin Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-6"
              >
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-3">
                  Adjusted Profit Margin
                </p>
                <div className="flex items-center space-x-3 mb-4">
                  <p className="text-5xl font-bold text-blue-700 dark:text-blue-400">
                    12.6%
                  </p>
                  <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                    Sustainable
                  </span>
                </div>
                <div className="w-full bg-blue-200/50 dark:bg-blue-900/30 rounded-full h-2.5 mb-1">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: '12.6%' }}
                  ></div>
                </div>
              </motion.div>

              {/* Financial Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-2 border-purple-200 dark:border-purple-700 rounded-2xl p-6"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-purple-200 dark:border-purple-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Total Revenue
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      ₹30L
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-purple-200 dark:border-purple-700">
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      Total Expenses
                    </span>
                    <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                      ₹26.2L
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                      Net Profit
                    </span>
                    <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                      ₹3.8L
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
