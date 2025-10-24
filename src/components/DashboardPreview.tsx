import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Mail, AlertCircle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const lineChartData = [
  { month: 'Jan', active: 45, expired: 5 },
  { month: 'Feb', active: 52, expired: 3 },
  { month: 'Mar', active: 48, expired: 7 },
  { month: 'Apr', active: 61, expired: 2 },
  { month: 'May', active: 55, expired: 6 },
  { month: 'Jun', active: 67, expired: 4 },
];

const barChartData = [
  { category: 'GitHub', count: 1249 },
  { category: 'Office365', count: 980 },
  { category: 'Adobe', count: 756 },
  { category: 'Spotify', count: 654 },
  { category: 'Canva', count: 543 },
];

const pieChartData = [
  { name: 'Active', value: 78, color: '#10B981' },
  { name: 'Expiring Soon', value: 15, color: '#F59E0B' },
  { name: 'Expired', value: 7, color: '#EF4444' },
];

const recentActivity = [
  { id: 1, action: 'GitHub Student Pack activated', time: '2 hours ago', status: 'success' },
  { id: 2, action: 'Office365 expiring in 30 days', time: '1 day ago', status: 'warning' },
  { id: 3, action: 'Canva Pro renewed', time: '3 days ago', status: 'success' },
  { id: 4, action: 'Adobe Creative expired', time: '1 week ago', status: 'error' },
];

export function DashboardPreview() {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
            Dashboard Preview
          </Badge>
          <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-6">
            Track Your Benefits
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Get real-time insights into your student benefits with our comprehensive 
            dashboard. Monitor expiration dates, discover new offers, and maximize your savings.
          </p>
        </motion.div>

        {/* Dashboard Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="bg-gray-100 dark:bg-gray-800 rounded-3xl p-8 shadow-2xl"
        >
          {/* Dashboard Header */}
          <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl text-gray-900 dark:text-white">EduBuzz Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-300">Welcome back, Alex! 👋</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Savings</div>
                  <div className="text-2xl text-green-600">$4,847</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white">A</span>
                </div>
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">Active Benefits</p>
                    <p className="text-2xl text-blue-900 dark:text-blue-100">23</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm">Expiring Soon</p>
                    <p className="text-2xl text-yellow-900 dark:text-yellow-100">4</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 border border-red-100 dark:border-red-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 dark:text-red-400 text-sm">Expired</p>
                    <p className="text-2xl text-red-900 dark:text-red-100">2</p>
                  </div>
                  <Mail className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm">This Month</p>
                    <p className="text-2xl text-green-900 dark:text-green-100">+6</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Line Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Benefits Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="active" stroke="#3B82F6" strokeWidth={3} />
                    <Line type="monotone" dataKey="expired" stroke="#EF4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Pie Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Status Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-4 mt-4">
                  {pieChartData.map((entry) => (
                    <div key={entry.name} className="flex items-center space-x-2">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
                      <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular Benefits Bar Chart */}
            <Card className="lg:col-span-2 border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Most Popular Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="category" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip 
                        cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                      />
                      <Bar 
                        dataKey="count" 
                        fill="#10B981" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.status === 'success' ? 'bg-green-500' :
                      activity.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100">{activity.action}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 font-semibold"
          >
            Access Your Dashboard
          </button>
        </motion.div>
      </div>
    </section>
  );
}