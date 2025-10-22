import { motion } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { CheckCircle, Clock, RefreshCw, Shield } from 'lucide-react';

const features = [
  {
    icon: CheckCircle,
    title: 'Instant Verification',
    description: 'Get verified in minutes with your student email address. Quick and hassle-free process.',
    color: 'from-green-500 to-emerald-600'
  },
  {
    icon: Clock,
    title: '24/7 Support',
    description: 'Round-the-clock customer support to help you with any questions or issues.',
    color: 'from-blue-500 to-cyan-600'
  },
  {
    icon: RefreshCw,
    title: 'Regular Updates',
    description: 'New benefits and offers added regularly. Never miss out on the latest student deals.',
    color: 'from-purple-500 to-violet-600'
  },
  {
    icon: Shield,
    title: 'Secure Platform',
    description: 'Your data is protected with enterprise-grade security and privacy measures.',
    color: 'from-orange-500 to-red-600'
  }
];

export function FeatureHighlights() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-6">
            Why Choose EduBuzz?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            We make accessing student benefits simple, secure, and rewarding. 
            Join thousands of students who trust us with their educational journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group"
              >
                <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white">
                  <CardContent className="p-8 text-center">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </motion.div>
                    
                    <h3 className="text-xl text-gray-900 mb-4 group-hover:text-blue-600 transition-colors duration-200">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}