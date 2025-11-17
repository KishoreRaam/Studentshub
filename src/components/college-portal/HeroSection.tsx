import { motion } from 'motion/react';
import { Building2, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { Badge } from '../ui/badge';

/**
 * Hero section for College Portal page
 */
export function HeroSection() {
  const stats = [
    { icon: Building2, label: 'Colleges Onboarded', value: '125+' },
    { icon: Users, label: 'Students Served', value: '50,000+' },
    { icon: TrendingUp, label: 'Market Value', value: '₹80Cr+' },
  ];

  const features = [
    'Professional institutional email addresses',
    'Setup completed in 48 hours',
    'Full Google Workspace integration',
    '24/7 technical support',
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 text-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Badge */}
          <Badge className="mb-6 bg-white/20 hover:bg-white/30 text-white border-0 text-sm px-4 py-1">
            EduDomain Solutions by StudentPerks
          </Badge>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Transform Your Institution's
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-blue-200">
              Digital Identity
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Get verified institutional email addresses for your students in 48 hours
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto mb-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="text-sm text-white">{feature}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 transition-colors duration-200"
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-green-300" />
                <p className="text-3xl font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-blue-100">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
