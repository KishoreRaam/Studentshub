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
                  className="rounded-xl p-4 border-2"
                  style={{
                    backgroundColor: '#FFF8F0',
                    borderColor: '#FED7AA'
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <span className="font-medium text-base" style={{ color: '#8B4513' }}>
                        {expense.label}
                      </span>
                      {expense.description && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          {expense.description}
                        </p>
                      )}
                    </div>
                    <span className="font-bold text-lg" style={{ color: '#7C2D12' }}>
                      {expense.amount}
                    </span>
                  </div>
                  <div className="w-full rounded-full h-2" style={{ backgroundColor: '#FFE4CC' }}>
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${expense.percentage}%`,
                        background: 'linear-gradient(to right, #FF6B35, #FFB088)'
                      }}
                    ></div>
                  </div>
                </motion.div>
              ))}

              {/* Total Expenses */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="rounded-xl p-5 mt-4 border-2"
                style={{
                  backgroundColor: '#FFF4E6',
                  borderColor: '#FED7AA'
                }}
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xl" style={{ color: '#7C2D12' }}>
                    Total Expenses
                  </span>
                  <span className="text-3xl font-bold" style={{ color: '#7C2D12' }}>
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
                className="border-2 rounded-2xl p-6"
                style={{
                  backgroundColor: '#E6F7FA',
                  borderColor: '#7DD3FC'
                }}
              >
                <p className="text-sm font-medium mb-2" style={{ color: '#64748B' }}>
                  Adjusted Net Profit
                </p>
                <p className="text-5xl font-bold mb-2" style={{ color: '#0369A1' }}>
                  ₹3.8L
                </p>
                <p className="text-sm" style={{ color: '#64748B' }}>
                  After all expenses including salaries
                </p>
              </motion.div>

              {/* Adjusted Profit Margin Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="border-2 rounded-2xl p-6"
                style={{
                  backgroundColor: '#E6F7FA',
                  borderColor: '#7DD3FC'
                }}
              >
                <p className="text-sm font-medium mb-3" style={{ color: '#64748B' }}>
                  Adjusted Profit Margin
                </p>
                <div className="flex items-center space-x-3 mb-4">
                  <p className="text-5xl font-bold" style={{ color: '#0369A1' }}>
                    12.6%
                  </p>
                  <span className="px-3 py-1 text-white text-xs font-bold rounded-full" style={{ backgroundColor: '#3B82F6' }}>
                    Sustainable
                  </span>
                </div>
                <div className="w-full rounded-full h-2.5 mb-1" style={{ backgroundColor: '#BAE6FD' }}>
                  <div
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{
                      width: '12.6%',
                      backgroundColor: '#22D3EE'
                    }}
                  ></div>
                </div>
              </motion.div>

              {/* Financial Summary Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="border-2 rounded-2xl p-6"
                style={{
                  backgroundColor: '#F8FAFC',
                  borderColor: '#CBD5E1'
                }}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: '#CBD5E1' }}>
                    <span className="font-medium" style={{ color: '#64748B' }}>
                      Total Revenue
                    </span>
                    <span className="text-xl font-bold" style={{ color: '#334155' }}>
                      ₹30L
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: '#CBD5E1' }}>
                    <span className="font-medium" style={{ color: '#64748B' }}>
                      Total Expenses
                    </span>
                    <span className="text-xl font-bold" style={{ color: '#334155' }}>
                      ₹26.2L
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-semibold text-lg" style={{ color: '#0891B2' }}>
                      Net Profit
                    </span>
                    <span className="text-2xl font-bold" style={{ color: '#0891B2' }}>
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
