import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Calendar, Mail, AlertCircle, CheckCircle, TrendingUp, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getSavedPerks, getSavedResources, getSavedAITools } from '../services/saved-items.service';

interface DashboardStats {
  totalSaved: number;
  perks: number;
  resources: number;
  aiTools: number;
  claimed: number;
}

export function DashboardPreview() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSaved: 0,
    perks: 0,
    resources: 0,
    aiTools: 0,
    claimed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const [perks, resources, aiTools] = await Promise.all([
          getSavedPerks(user.$id),
          getSavedResources(user.$id),
          getSavedAITools(user.$id),
        ]);

        const claimed = perks.filter((p: any) => p.claimed).length;

        setStats({
          totalSaved: perks.length + resources.length + aiTools.length,
          perks: perks.length,
          resources: resources.length,
          aiTools: aiTools.length,
          claimed,
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, [user]);

  // Calculate dynamic data based on real stats
  const activeBenefits = stats.claimed;
  const totalItems = stats.totalSaved;
  const pendingClaims = stats.perks - stats.claimed;

  const pieChartData = [
    { name: 'Claimed', value: stats.claimed || 0, color: '#10B981' },
    { name: 'Pending', value: pendingClaims || 0, color: '#F59E0B' },
    { name: 'Resources', value: (stats.resources + stats.aiTools) || 0, color: '#3B82F6' },
  ];

  const barChartData = [
    { category: 'Perks', count: stats.perks },
    { category: 'Resources', count: stats.resources },
    { category: 'AI Tools', count: stats.aiTools },
    { category: 'Claimed', count: stats.claimed },
  ];

  const recentActivity = user ? [
    { id: 1, action: `${stats.perks} perks saved`, time: 'Active', status: 'success' },
    { id: 2, action: `${pendingClaims} pending claims`, time: user ? 'Your account' : 'Login to see', status: pendingClaims > 0 ? 'warning' : 'success' },
    { id: 3, action: `${stats.resources} resources available`, time: 'Ready to use', status: 'success' },
    { id: 4, action: `${stats.aiTools} AI tools saved`, time: 'Available', status: 'success' },
  ] : [
    { id: 1, action: 'Login to see your activity', time: 'Sign in required', status: 'warning' },
  ];

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
                <p className="text-gray-600 dark:text-gray-300">
                  {user ? `Welcome back, ${user.name || 'Student'}! 👋` : 'Sign in to track your benefits 👋'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">Total Saved</div>
                      <div className="text-2xl text-green-600">{totalItems} items</div>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 dark:text-blue-400 text-sm">Active Benefits</p>
                    <p className="text-2xl text-blue-900 dark:text-blue-100">{loading ? '...' : activeBenefits}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              
              <div className="bg-yellow-50 dark:bg-yellow-900/30 rounded-xl p-4 border border-yellow-100 dark:border-yellow-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 dark:text-yellow-400 text-sm">Pending Claims</p>
                    <p className="text-2xl text-yellow-900 dark:text-yellow-100">{loading ? '...' : pendingClaims}</p>
                  </div>
                  <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              
              <div className="bg-purple-50 dark:bg-purple-900/30 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 dark:text-purple-400 text-sm">Resources</p>
                    <p className="text-2xl text-purple-900 dark:text-purple-100">{loading ? '...' : stats.resources}</p>
                  </div>
                  <Mail className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              
              <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 border border-green-100 dark:border-green-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 text-sm">AI Tools</p>
                    <p className="text-2xl text-green-900 dark:text-green-100">{loading ? '...' : stats.aiTools}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Pie Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-green-600" />
                  <span>Your Items Distribution</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalItems > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie
                          data={pieChartData.filter(d => d.value > 0)}
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
                      {pieChartData.filter(d => d.value > 0).map((entry) => (
                        <div key={entry.name} className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: entry.color }} />
                          <span className="text-sm text-gray-600 dark:text-gray-300">{entry.name}: {entry.value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {user ? 'No saved items yet. Start exploring!' : 'Login to see your stats'}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bar Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span>Your Collection</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {totalItems > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={barChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="category" stroke="#666" />
                      <YAxis stroke="#666" />
                      <Tooltip />
                      <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    {user ? 'Save items to see your collection grow!' : 'Login to track your progress'}
                  </div>
                )}
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