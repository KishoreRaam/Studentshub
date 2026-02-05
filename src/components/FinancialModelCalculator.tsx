import { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, Percent, Users, Info, IndianRupee, Briefcase } from 'lucide-react';

// Constants
const TOTAL_COLLEGES = 2000;
const SETUP_FEE_PER_COLLEGE = 5000;
const MAINTENANCE_FEE_PER_COLLEGE = 10000;
const REVENUE_PER_STUDENT = 30;
const COST_PER_STUDENT = 12;
const FIXED_COST = 1800000; // ₹18L per year

interface FinancialResults {
  collegesOnboarded: number;
  totalStudents: number;
  setupRevenue: number;
  maintenanceRevenue: number;
  studentRevenue: number;
  totalRevenue: number;
  variableCost: number;
  totalCost: number;
  netOutcome: number;
  status: 'PROFIT' | 'LOSS';
  profitMargin: number;
}

const calculateFinancials = (
  marketCapturePercent: number,
  avgStudentsPerCollege: number
): FinancialResults => {
  // Convert to fraction
  const marketCapture = marketCapturePercent / 100;

  // Compute scale
  const collegesOnboarded = TOTAL_COLLEGES * marketCapture;
  const totalStudents = collegesOnboarded * avgStudentsPerCollege;

  // Compute revenue
  const setupRevenue = collegesOnboarded * SETUP_FEE_PER_COLLEGE;
  const maintenanceRevenue = collegesOnboarded * MAINTENANCE_FEE_PER_COLLEGE;
  const studentRevenue = totalStudents * REVENUE_PER_STUDENT;
  const totalRevenue = setupRevenue + maintenanceRevenue + studentRevenue;

  // Compute costs
  const variableCost = totalStudents * COST_PER_STUDENT;
  const totalCost = variableCost + FIXED_COST;

  // Compute net outcome
  const netOutcome = totalRevenue - totalCost;
  const status = netOutcome >= 0 ? 'PROFIT' : 'LOSS';
  const profitMargin = totalRevenue > 0 ? (netOutcome / totalRevenue) * 100 : 0;

  return {
    collegesOnboarded,
    totalStudents,
    setupRevenue,
    maintenanceRevenue,
    studentRevenue,
    totalRevenue,
    variableCost,
    totalCost,
    netOutcome,
    status,
    profitMargin,
  };
};

const formatToLakhs = (value: number): string => {
  return `₹${(value / 100000).toFixed(2)}L`;
};

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-IN').format(Math.round(value));
};

export default function FinancialModelCalculator() {
  const [marketCapturePercent, setMarketCapturePercent] = useState(10);
  const [avgStudentsPerCollege, setAvgStudentsPerCollege] = useState(2000);
  const [showProfitState, setShowProfitState] = useState(false);

  const results = useMemo(
    () => calculateFinancials(marketCapturePercent, avgStudentsPerCollege),
    [marketCapturePercent, avgStudentsPerCollege]
  );

  // Delayed profit state transition (2.5 seconds after market capture >= 17% and profit)
  useEffect(() => {
    if (marketCapturePercent >= 17 && results.netOutcome > 0) {
      const timer = setTimeout(() => {
        setShowProfitState(true);
      }, 2500);
      return () => clearTimeout(timer);
    } else {
      setShowProfitState(false);
    }
  }, [marketCapturePercent, results.netOutcome]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-8"
    >
      {/* Slider Controls Card */}
      <div className="p-6 mb-6 bg-white dark:bg-gray-800 shadow-lg rounded-2xl border-t-4 border-indigo-500">
        <h3 className="text-indigo-900 dark:text-indigo-300 mb-6 text-center text-xl font-semibold">
          Financial Model Controls
        </h3>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Market Capture Slider */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Percent className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Market Capture %</span>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg shadow-md">
                <span className="text-xl font-bold">{marketCapturePercent}%</span>
              </div>
            </div>
            
            <input
              type="range"
              min="1"
              max="50"
              value={marketCapturePercent}
              onChange={(e) => setMarketCapturePercent(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-thumb-financial"
              style={{
                background: `linear-gradient(to right, #6366f1 0%, #a855f7 ${marketCapturePercent * 2}%, #e2e8f0 ${marketCapturePercent * 2}%, #e2e8f0 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>1%</span>
              <span>25%</span>
              <span>50%</span>
            </div>
            
            <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                <strong className="text-indigo-600 dark:text-indigo-400">{results.collegesOnboarded}</strong> colleges captured out of {TOTAL_COLLEGES.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Average Students per College */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-slate-700 dark:text-slate-300 font-medium">Avg Students/College</span>
                <div className="group relative">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-56 p-3 bg-slate-800 text-white text-xs rounded-lg shadow-xl z-10">
                    <p>Higher student count increases infrastructure and support costs (bandwidth, servers, support staff)</p>
                    <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-800"></div>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md">
                <span className="text-xl font-bold">{avgStudentsPerCollege.toLocaleString()}</span>
              </div>
            </div>
            
            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={avgStudentsPerCollege}
              onChange={(e) => setAvgStudentsPerCollege(Number(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer slider-thumb-students"
              style={{
                background: `linear-gradient(to right, #a855f7 0%, #ec4899 ${((avgStudentsPerCollege - 500) / 9500) * 100}%, #e2e8f0 ${((avgStudentsPerCollege - 500) / 9500) * 100}%, #e2e8f0 100%)`
              }}
            />
            
            <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
              <span>500</span>
              <span>5,000</span>
              <span>10,000</span>
            </div>
            
            <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
              <p className="text-sm text-slate-700 dark:text-slate-300">
                Total students: <strong className="text-purple-600 dark:text-purple-400">{results.totalStudents.toLocaleString()}</strong>
              </p>
            </div>
          </div>
        </div>

        <style>{`
          .slider-thumb-financial::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
            transition: all 0.2s ease;
          }
          .slider-thumb-financial::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.6);
          }
          .slider-thumb-financial::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #6366f1, #a855f7);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
          }
          .slider-thumb-students::-webkit-slider-thumb {
            appearance: none;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #a855f7, #ec4899);
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
            transition: all 0.2s ease;
          }
          .slider-thumb-students::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            box-shadow: 0 4px 12px rgba(168, 85, 247, 0.6);
          }
          .slider-thumb-students::-moz-range-thumb {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: linear-gradient(135deg, #a855f7, #ec4899);
            cursor: pointer;
            border: none;
            box-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
          }
        `}</style>
      </div>

      {/* Financial Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Revenue Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border-l-4 border-blue-500 shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <IndianRupee className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Total Revenue</h3>
          </div>
          <p className="text-4xl font-bold text-blue-900 dark:text-blue-300 mb-4">
            {formatToLakhs(results.totalRevenue)}
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex justify-between items-center">
              <span>Setup:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatToLakhs(results.setupRevenue)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Maintenance:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatToLakhs(results.maintenanceRevenue)}</span>
            </div>
            <div className="pt-2 mt-2 border-t border-cyan-200 dark:border-cyan-800">
              <div className="flex items-center justify-between mb-1">
                <span className="text-cyan-700 dark:text-cyan-400 font-medium">Student Revenue:</span>
                <span className="px-2 py-0.5 border border-cyan-400 dark:border-cyan-600 text-cyan-700 dark:text-cyan-400 text-xs rounded-full">
                  ₹{REVENUE_PER_STUDENT}/student
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-1">
                ₹{REVENUE_PER_STUDENT}/student × {results.totalStudents.toLocaleString()}
              </p>
              <p className="text-cyan-800 dark:text-cyan-400 font-semibold">{formatToLakhs(results.studentRevenue)}</p>
            </div>
          </div>
        </motion.div>

        {/* Variable Costs Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-2xl p-6 border-l-4 border-orange-500 shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Variable Costs</h3>
          </div>
          <p className="text-4xl font-bold text-orange-900 dark:text-orange-300 mb-4">
            {formatToLakhs(results.variableCost)}
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-medium">Infrastructure & Support</p>
            <p>₹{COST_PER_STUDENT}/student × {results.totalStudents.toLocaleString()}</p>
          </div>
        </motion.div>

        {/* Fixed Costs Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 rounded-2xl p-6 border-l-4 border-purple-500 shadow-md"
        >
          <div className="flex items-center gap-2 mb-4">
            <Briefcase className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300">Fixed Costs</h3>
          </div>
          <p className="text-4xl font-bold text-purple-900 dark:text-purple-300 mb-4">
            {formatToLakhs(FIXED_COST)}
          </p>
          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
            <p className="font-medium">Platform, Team, Infrastructure</p>
            <p>Independent of scale</p>
          </div>
        </motion.div>
      </div>

      {/* Net Outcome Section - 3 State Logic */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className={`rounded-2xl p-8 transition-all duration-1000 shadow-2xl ${
          results.netOutcome < 0 
            ? 'border-2 border-red-300' 
            : results.netOutcome === 0 
              ? 'border-2 border-slate-300'
              : showProfitState
                ? 'border-2 border-transparent'
                : 'border-2 border-slate-300'
        }`}
        style={{
          background: results.netOutcome < 0
            ? 'linear-gradient(to bottom right, #fef2f2, #fff7ed)'
            : results.netOutcome === 0
              ? 'linear-gradient(to bottom right, #f8fafc, #f9fafb)'
              : showProfitState
                ? '#00CE6D'
                : 'linear-gradient(to bottom right, #f8fafc, #f9fafb)'
        }}
      >
        <div className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {results.netOutcome < 0 ? (
              <div className="p-4 bg-red-500 rounded-full">
                <TrendingUp className="w-8 h-8 text-white rotate-180" />
              </div>
            ) : (
              <div className={`p-4 rounded-full transition-all duration-1000 ${
                showProfitState ? 'bg-white' : 'bg-slate-400'
              }`}>
                <TrendingUp className={`w-8 h-8 transition-all duration-1000 ${
                  showProfitState ? 'text-green-600' : 'text-white'
                }`} />
              </div>
            )}
            <h2 className={`transition-all duration-1000 text-2xl md:text-3xl font-bold ${
              showProfitState ? 'text-white' : results.netOutcome < 0 ? 'text-red-900' : 'text-slate-900'
            }`}>
              Net Outcome
            </h2>
          </div>

          <div className={`text-6xl md:text-7xl font-bold mb-4 transition-all duration-700 ${
            showProfitState ? 'text-white' : results.netOutcome < 0 ? 'text-red-600' : 'text-slate-800'
          }`}>
            {results.netOutcome < 0 ? '-' : '+'}₹{Math.abs(results.netOutcome / 100000).toFixed(2)}L
          </div>

          {results.netOutcome < 0 && (
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-red-500 text-white mb-4">Operational Loss</span>
              <p className="text-sm text-red-800 mb-4">
                Per-student revenue (₹{REVENUE_PER_STUDENT}) + college fees not covering ₹{COST_PER_STUDENT}/student costs and ₹{(FIXED_COST/100000).toFixed(0)}L fixed costs.
              </p>
              <div className="grid md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-red-700">↑ Increase market capture for scale</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-red-700">↓ Reduce cost/student below ₹{COST_PER_STUDENT}</p>
                </div>
                <div className="p-3 bg-white rounded-lg border border-red-200">
                  <p className="text-red-700">→ Student revenue needs more/student</p>
                </div>
              </div>
            </div>
          )}

          {results.netOutcome >= 0 && !showProfitState && (
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-slate-500 text-white mb-4">Stabilizing...</span>
              <p className="text-sm text-slate-700">
                Revenue exceeds costs. Transitioning to profit state...
              </p>
              <div className="mt-4 flex justify-center">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}

          {showProfitState && (
            <div className="max-w-2xl mx-auto">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white text-green-600 mb-4 font-semibold">Net Profit Achieved</span>
              <p className="text-white mb-6 text-base font-medium">
                Sustainable business model with positive cash flow
              </p>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-white bg-opacity-90 backdrop-blur rounded-lg border-2 border-white shadow-lg">
                  <p className="text-green-700 font-bold text-lg">
                    {((results.netOutcome / results.totalRevenue) * 100).toFixed(1)}%
                  </p>
                  <p className="text-green-600 text-xs mt-1">Profit Margin</p>
                </div>
                <div className="p-4 bg-white bg-opacity-90 backdrop-blur rounded-lg border-2 border-white shadow-lg">
                  <p className="text-blue-700 font-bold text-lg">
                    ₹{(results.totalRevenue / 100000).toFixed(1)}L
                  </p>
                  <p className="text-blue-600 text-xs mt-1">Total Revenue</p>
                </div>
                <div className="p-4 bg-white bg-opacity-90 backdrop-blur rounded-lg border-2 border-white shadow-lg">
                  <p className="text-orange-700 font-bold text-lg">
                    ₹{((results.variableCost + FIXED_COST) / 100000).toFixed(1)}L
                  </p>
                  <p className="text-orange-600 text-xs mt-1">Total Costs</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Model Insights */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border-l-4 border-blue-500"
      >
        <div className="flex items-start space-x-3">
          <Info className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">Model Insights:</h4>
            <p className="text-sm text-blue-800 dark:text-blue-300">
              Revenue now includes ₹{REVENUE_PER_STUDENT} per student (alongside college fees), ensuring symmetric scaling.
              {results.status === 'PROFIT'
                ? ' Excellent margins! Per-student revenue compounding while fixed costs remain stable.'
                : ' Increase market capture or average students per college to achieve profitability.'}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
