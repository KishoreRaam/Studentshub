import { motion } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const partners = [
  {
    name: 'GitHub',
    logo: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fcc1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnaXRodWIlMjBsb2dvfGVufDF8fHx8MTc1NzQzMTI5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Development'
  },
  {
    name: 'Microsoft',
    logo: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3NvZnQlMjBsb2dvfGVufDF8fHx8MTc1NzQzMTI5M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Productivity'
  },
  {
    name: 'Adobe',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZG9iZSUyMGxvZ298ZW58MXx8fHwxNzU3NDMxMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Creative'
  },
  {
    name: 'Spotify',
    logo: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwbG9nb3xlbnwxfHx8fDE3NTc0MzEyOTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Entertainment'
  },
  {
    name: 'Canva',
    logo: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW52YSUyMGxvZ298ZW58MXx8fHwxNzU3NDMxMjkzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Design'
  },
  {
    name: 'Figma',
    logo: 'https://images.unsplash.com/photo-1609921141835-710b7fa6e438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWdtYSUyMGxvZ298ZW58MXx8fHwxNzU3NDMxMjkzfDA&ixlib=rb-4.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    category: 'Design'
  }
];

const trustBadges = [
  {
    name: 'SOC 2 Certified',
    description: 'Security & Privacy Compliant'
  },
  {
    name: 'GDPR Compliant',
    description: 'Data Protection Standards'
  },
  {
    name: 'Student Verified',
    description: 'Trusted by Universities'
  },
  {
    name: '99.9% Uptime',
    description: 'Reliable Service'
  }
];

export function PartnerLogos() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trusted Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl text-gray-900 mb-6">
            Trusted by Leading Companies
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
            We partner with industry leaders to bring you the best student benefits 
            and exclusive access to professional tools.
          </p>

          {/* Partner Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.1 }}
                className="group cursor-pointer"
              >
                <div className="bg-gray-50 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300 shadow-sm hover:shadow-md">
                  <div className="aspect-square relative mb-3">
                    <ImageWithFallback
                      src={partner.logo}
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    {partner.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {partner.category}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-200 pt-16"
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl text-gray-900 mb-4">
              Security & Trust You Can Count On
            </h3>
            <p className="text-gray-600">
              Your privacy and security are our top priorities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
                <h4 className="text-gray-900 mb-2">
                  {badge.name}
                </h4>
                <p className="text-sm text-gray-600">
                  {badge.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}