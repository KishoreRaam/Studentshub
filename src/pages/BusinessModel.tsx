import { motion } from 'motion/react';
import { Briefcase, IndianRupee, TrendingUp, PieChart, Award, Target } from 'lucide-react';

export default function BusinessModel() {
  const expenses = [
    { label: 'Platform Development', amount: '₹5L', percentage: 29 },
    { label: 'Marketing & Sales', amount: '₹4L', percentage: 23 },
    { label: 'Operations', amount: '₹3.2L', percentage: 19 },
    { label: 'Support & Maintenance', amount: '₹3L', percentage: 17 },
    { label: 'Miscellaneous', amount: '₹2L', percentage: 12 }
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-16 px-4 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
            StudentPerks Business Model
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-4xl mx-auto">
            A comprehensive overview of our revenue model, market potential, and financial projections
            for Tamil Nadu's college ecosystem
          </p>
        </motion.div>

        {/* Market Overview Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <div className="border-4 border-indigo-500 rounded-3xl p-8 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
                <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Market Overview
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 text-center"
              >
                <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                  2,000
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Total Colleges in Tamil Nadu
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 text-center"
              >
                <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                  10%
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Target Market Share
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-8 text-center"
              >
                <p className="text-5xl font-bold text-indigo-600 dark:text-indigo-400 mb-3">
                  200
                </p>
                <p className="text-gray-600 dark:text-gray-300 font-medium">
                  Target Colleges
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Pricing Model Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <div className="border-4 border-emerald-500 rounded-3xl p-8 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
                <IndianRupee className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Pricing Model
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-8 bg-emerald-50/50 dark:bg-emerald-900/10"
              >
                <div className="flex items-baseline space-x-2 mb-3">
                  <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹5,000
                  </span>
                  <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm rounded-full font-medium">
                    One-time
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Initial Setup Fee
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Per college onboarding charge
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="border-2 border-emerald-300 dark:border-emerald-700 rounded-2xl p-8 bg-emerald-50/50 dark:bg-emerald-900/10"
              >
                <div className="flex items-baseline space-x-2 mb-3">
                  <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹10,000
                  </span>
                  <span className="px-3 py-1 bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-300 text-sm rounded-full font-medium">
                    Annual
                  </span>
                </div>
                <p className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Yearly Maintenance
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  Ongoing platform support
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Revenue Projection Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-8"
        >
          <div className="border-4 border-blue-500 rounded-3xl p-8 bg-white dark:bg-gray-800">
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Revenue Projection
              </h2>
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-1">
                    Setup Fee Revenue
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    200 colleges × ₹5,000
                  </p>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ₹10,00,000
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 flex justify-between items-center"
              >
                <div>
                  <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg mb-1">
                    Maintenance Revenue
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    200 colleges × ₹10,000
                  </p>
                </div>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  ₹20,00,000
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-700 dark:to-blue-600 rounded-2xl p-8 flex justify-between items-center"
              >
                <div>
                  <p className="text-white font-bold text-2xl mb-1">
                    Total Revenue
                  </p>
                  <p className="text-blue-100 text-sm">
                    First year projected income
                  </p>
                </div>
                <p className="text-5xl font-bold text-white">
                  ₹30L
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Grid: Expenses and Profit */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Expenses Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="border-4 border-orange-500 rounded-3xl p-8 bg-white dark:bg-gray-800 h-full">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                  <PieChart className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Expenses Breakdown
                </h2>
              </div>

              <div className="space-y-6">
                {expenses.map((expense, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                    className="bg-orange-50/50 dark:bg-orange-900/10 rounded-xl p-4"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-gray-700 dark:text-gray-300 font-medium">
                        {expense.label}
                      </span>
                      <span className="text-orange-600 dark:text-orange-400 font-bold">
                        {expense.amount}
                      </span>
                    </div>
                    <div className="w-full bg-orange-100 dark:bg-orange-900/20 rounded-full h-2.5">
                      <div
                        className="bg-gradient-to-r from-orange-600 to-orange-400 h-2.5 rounded-full"
                        style={{ width: `${expense.percentage}%` }}
                      ></div>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="bg-orange-100 dark:bg-orange-900/30 rounded-xl p-6 mt-6"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-orange-900 dark:text-orange-200 font-bold text-xl">
                      Total Expenses
                    </span>
                    <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                      ₹17.2L
                    </span>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Profit Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <div className="border-4 border-green-500 rounded-3xl p-8 bg-white dark:bg-gray-800 h-full">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                  <Award className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                  Profit Summary
                </h2>
              </div>

              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  className="border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 rounded-2xl p-8"
                >
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-3">
                    Net Profit
                  </p>
                  <p className="text-6xl font-bold text-green-600 dark:text-green-400 mb-2">
                    ₹12.8L
                  </p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    First year projected profit
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                  className="border-2 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/10 rounded-2xl p-8"
                >
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    Profit Margin
                  </p>
                  <div className="flex items-center space-x-3 mb-4">
                    <p className="text-5xl font-bold text-green-600 dark:text-green-400">
                      43%
                    </p>
                    <span className="px-4 py-2 bg-green-500 text-white text-sm rounded-full font-bold">
                      Healthy
                    </span>
                  </div>
                  <div className="w-full bg-green-100 dark:bg-green-900/20 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full"
                      style={{ width: '43%' }}
                    ></div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-6"
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
                      Key Metrics
                    </h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Revenue per College</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">₹15,000</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Cost per College</span>
                      <span className="font-bold text-gray-800 dark:text-gray-200">₹8,600</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Profit per College</span>
                      <span className="font-bold text-green-600 dark:text-green-400">₹6,400</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-center text-gray-500 dark:text-gray-400 mt-12 text-sm"
        >
          All figures are projected for Year 1 based on 10% market penetration in Tamil Nadu
        </motion.p>
      </div>
    </main>
  );
}
