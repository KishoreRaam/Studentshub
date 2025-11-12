import { motion } from 'motion/react';
import { Briefcase, IndianRupee, TrendingUp } from 'lucide-react';
import ThreePhaseGrowth from '../components/ThreePhaseGrowth';
import SalaryAdjustedFinancial from '../components/SalaryAdjustedFinancial';
import AlternativeProfitStrategies from '../components/AlternativeProfitStrategies';

export default function BusinessModel() {

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
                className="rounded-2xl p-8 flex justify-between items-center shadow-xl border-2"
                style={{
                  background: 'linear-gradient(to right, #10B981, #34D399)',
                  borderColor: '#059669'
                }}
              >
                <div>
                  <p className="text-white font-bold text-2xl mb-1 drop-shadow-md">
                    Total Revenue
                  </p>
                  <p className="text-white text-sm opacity-90">
                    First year projected income
                  </p>
                </div>
                <p className="text-5xl font-bold text-white drop-shadow-lg">
                  ₹30L
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Salary-Adjusted Financial Projection */}
        <SalaryAdjustedFinancial />

        {/* Alternative Profit Strategies */}
        <AlternativeProfitStrategies />

        {/* Cost Optimization Strategy */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-8"
        >
          <div className="border-4 rounded-3xl p-8 bg-white dark:bg-gray-800" style={{ borderColor: '#10B981' }}>
            <div className="flex items-center space-x-3 mb-8">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#D1FAE5' }}>
                <svg className="w-7 h-7" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Cost Optimization Strategy
              </h2>
            </div>

            {/* Three Strategy Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* Freelance Roles Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="rounded-2xl p-6 border-2"
                style={{ backgroundColor: '#FAF5FF', borderColor: '#E9D5FF' }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6" style={{ color: '#9333EA' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-semibold" style={{ color: '#6B21A8' }}>Freelance Roles</h3>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#6B21A8' }}>UI/UX Designer (₹30k/project)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#6B21A8' }}>Content Writer (₹15k/month)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#6B21A8' }}>Digital Marketing (₹25k/month)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#6B21A8' }}>Video Editor (₹20k/project)</span>
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: '#EDE9FE' }}>
                  <p className="text-sm font-semibold" style={{ color: '#7C3AED' }}>Savings: ₹2.5L/year vs full-time</p>
                </div>
              </motion.div>

              {/* Automated Functions Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="rounded-2xl p-6 border-2"
                style={{ backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6" style={{ color: '#0284C7' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <h3 className="text-lg font-semibold" style={{ color: '#0369A1' }}>Automated Functions</h3>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#0369A1' }}>Email marketing (MailChimp)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#0369A1' }}>Customer support (Chatbot)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#0369A1' }}>Invoicing (Zoho Books)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm" style={{ color: '#0369A1' }}>Social media (Buffer/Hootsuite)</span>
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: '#E0F2FE' }}>
                  <p className="text-sm font-semibold" style={{ color: '#0369A1' }}>Savings: ₹4L/year in FTE costs</p>
                </div>
              </motion.div>

              {/* Delayed Hires Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="rounded-2xl p-6 border-2"
                style={{ backgroundColor: '#FFF7ED', borderColor: '#FED7AA' }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-6 h-6" style={{ color: '#EA580C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                  </svg>
                  <h3 className="text-lg font-semibold" style={{ color: '#C2410C' }}>Delayed Hires</h3>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#EA580C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    </svg>
                    <span className="text-sm" style={{ color: '#C2410C' }}>HR Manager (until 100+ employees)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#EA580C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    </svg>
                    <span className="text-sm" style={{ color: '#C2410C' }}>Finance Manager (use CA)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#EA580C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    </svg>
                    <span className="text-sm" style={{ color: '#C2410C' }}>Legal Counsel (retainer basis)</span>
                  </div>
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: '#EA580C' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth={2} />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" />
                    </svg>
                    <span className="text-sm" style={{ color: '#C2410C' }}>Data Analyst (Phase 3)</span>
                  </div>
                </div>
                <div className="rounded-lg p-3" style={{ backgroundColor: '#FFEDD5' }}>
                  <p className="text-sm font-semibold" style={{ color: '#C2410C' }}>Savings: ₹6L/year in early phase</p>
                </div>
              </motion.div>
            </div>

            {/* Total Savings Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="rounded-2xl p-6 border-l-4"
              style={{ backgroundColor: '#ECFDF5', borderColor: '#10B981' }}
            >
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 mt-1 flex-shrink-0" style={{ color: '#10B981' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="font-bold text-lg mb-2" style={{ color: '#065F46' }}>
                    Total Annual Savings: ₹12.5L
                  </p>
                  <p className="text-sm" style={{ color: '#047857' }}>
                    Through strategic use of freelancers, automation tools, and delayed hiring, StudentPerks reduces operational costs by 30-40% while maintaining productivity and quality standards.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Three Phase Growth Strategy */}
        <ThreePhaseGrowth />

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
