import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { 
  Star, 
  ChevronRight, 
  Github, 
  Package, 
  ExternalLink,
  Code,
  Server,
  Globe,
  Database,
  Palette,
  Shield,
  Briefcase,
  Mail,
  Cloud,
  X
} from 'lucide-react';

// GitHub Student Pack benefits data
const githubPackBenefits = [
  {
    id: 'jetbrains',
    name: 'JetBrains',
    offer: 'All IDEs Free',
    description: 'Professional development environments for all programming languages',
    icon: Code,
    bgColor: 'bg-orange-500',
    value: '$649/year',
    category: 'Development'
  },
  {
    id: 'digitalocean',
    name: 'DigitalOcean',
    offer: '$200 Credits',
    description: 'Cloud hosting and infrastructure services for your projects',
    icon: Server,
    bgColor: 'bg-blue-500',
    value: '$200',
    category: 'Cloud'
  },
  {
    id: 'namecheap',
    name: 'Namecheap',
    offer: 'Free .me Domain',
    description: 'One year free domain registration with SSL certificate',
    icon: Globe,
    bgColor: 'bg-green-500',
    value: '$8.88/year',
    category: 'Domain'
  },
  {
    id: 'mongodb',
    name: 'MongoDB Atlas',
    offer: '$200 Credits',
    description: 'NoSQL database cloud service with global clusters',
    icon: Database,
    bgColor: 'bg-green-600',
    value: '$200',
    category: 'Database'
  },
  {
    id: 'canva',
    name: 'Canva Pro',
    offer: 'Free Education Plan',
    description: 'Premium design tools with unlimited downloads and templates',
    icon: Palette,
    bgColor: 'bg-purple-500',
    value: '$120/year',
    category: 'Design'
  },
  {
    id: 'auth0',
    name: 'Auth0',
    offer: 'Free Authentication',
    description: 'Identity management platform for secure authentication',
    icon: Shield,
    bgColor: 'bg-orange-600',
    value: '$23/month',
    category: 'Security'
  },
  {
    id: 'stripe',
    name: 'Stripe',
    offer: 'Waived Processing Fees',
    description: 'Payment processing platform for your applications',
    icon: Briefcase,
    bgColor: 'bg-indigo-500',
    value: '$1000+',
    category: 'Payments'
  },
  {
    id: 'mailgun',
    name: 'Mailgun',
    offer: '$20/month Credits',
    description: 'Email API service for transactional emails',
    icon: Mail,
    bgColor: 'bg-red-500',
    value: '$240/year',
    category: 'Email'
  },
  {
    id: 'heroku',
    name: 'Heroku',
    offer: 'Free Dynos',
    description: 'Cloud platform for deploying and hosting applications',
    icon: Cloud,
    bgColor: 'bg-purple-600',
    value: '$25/month',
    category: 'Hosting'
  }
];

interface GitHubStudentPackProps {
  onClick?: () => void;
  className?: string;
}

export function GitHubStudentPack({ onClick, className }: GitHubStudentPackProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = () => {
    setIsExpanded(true);
    onClick?.();
  };

  return (
    <>
      {/* Main Bundle Card */}
      <motion.div
        layoutId="github-pack-card"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        whileHover={{ y: -8, scale: 1.02 }}
        className={`group cursor-pointer col-span-1 md:col-span-2 ${className}`}
        onClick={handleCardClick}
      >
        <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.4),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_48%,rgba(59,130,246,0.1)_49%,rgba(59,130,246,0.1)_51%,transparent_52%)] bg-[length:20px_20px]" />
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start">
            <motion.div layoutId="github-pack-bundle">
              <div className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <Package className="w-3 h-3" />
                <span>90+ Bundle</span>
              </div>
            </motion.div>
            
            <motion.div layoutId="github-pack-popular">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                <Star className="w-3 h-3 fill-current" />
                <span>Most Popular</span>
              </div>
            </motion.div>
          </div>

          <CardContent className="p-6 md:p-8 relative z-10 pt-16">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0 mb-6">
              <motion.div 
                layoutId="github-pack-icon"
                className="w-16 h-16 bg-white rounded-2xl p-3 flex items-center justify-center flex-shrink-0"
              >
                <Github className="w-10 h-10 text-black" />
              </motion.div>
              
              <div className="flex-1">
                <motion.div layoutId="github-pack-badge" className="mb-2">
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Developer Pack
                  </Badge>
                </motion.div>
                
                <motion.h3 
                  layoutId="github-pack-title"
                  className="text-2xl md:text-3xl lg:text-4xl mb-2 group-hover:text-blue-300 transition-colors duration-200"
                >
                  GitHub Student Pack
                </motion.h3>
                
                <motion.p 
                  layoutId="github-pack-subtitle"
                  className="text-gray-300 text-base md:text-lg"
                >
                  90+ free tools and services worth ₹1,60,000+
                </motion.p>
              </div>

              <motion.div 
                layoutId="github-pack-value"
                className="text-right lg:text-right text-left"
              >
                <div className="text-green-400 text-xl md:text-2xl">₹1,60,000+</div>
                <div className="text-gray-400 text-sm">Total Value</div>
              </motion.div>
            </div>

            {/* Preview Benefits - Responsive Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 mb-6">
              {githubPackBenefits.slice(0, 6).map((benefit) => {
                const IconComponent = benefit.icon;
                return (
                  <div key={benefit.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center hover:bg-white/15 transition-colors">
                    <IconComponent className="w-5 h-5 mx-auto mb-2 text-blue-300" />
                    <div className="text-xs text-gray-300 truncate">{benefit.name}</div>
                  </div>
                );
              })}
            </div>

            {/* Description */}
            <motion.p 
              layoutId="github-pack-description"
              className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base"
            >
              The ultimate developer toolkit with premium access to industry-leading tools, 
              cloud services, and educational resources. Everything you need to build, deploy, 
              and scale your projects.
            </motion.p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div className="flex items-center text-blue-300 group-hover:text-blue-200 transition-colors duration-200">
                <span className="mr-2 text-sm md:text-base">Explore all perks</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </div>
              
              <div className="text-sm text-gray-400">
                Click to view all 90+ benefits →
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Expanded Modal View */}
      <AnimatePresence>
        {isExpanded && (
          <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
            <DialogContent className="max-w-7xl h-[90vh] overflow-hidden p-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white border-gray-700">
              <div className="flex flex-col h-full max-h-[90vh]">
                {/* Header */}
                <DialogHeader className="p-4 md:p-6 border-b border-gray-700 flex-shrink-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-6 space-y-4 lg:space-y-0">
                    <motion.div 
                      layoutId="github-pack-icon"
                      className="w-16 h-16 bg-white rounded-2xl p-3 flex items-center justify-center flex-shrink-0"
                    >
                      <Github className="w-10 h-10 text-black" />
                    </motion.div>
                    
                    <div className="flex-1">
                      <DialogTitle className="text-2xl md:text-3xl lg:text-4xl mb-2">
                        <motion.span layoutId="github-pack-title">
                          GitHub Student Pack
                        </motion.span>
                      </DialogTitle>
                      <motion.p 
                        layoutId="github-pack-subtitle"
                        className="text-gray-300 text-base md:text-lg"
                      >
                        90+ free tools and services worth ₹1,60,000+
                      </motion.p>
                    </div>
                    
                    <motion.div 
                      layoutId="github-pack-value"
                      className="text-right lg:text-right text-left"
                    >
                      <div className="text-green-400 text-xl md:text-2xl">₹1,60,000+</div>
                      <div className="text-gray-400 text-sm">Total Value</div>
                    </motion.div>
                  </div>
                  
                  <motion.div layoutId="github-pack-description">
                    <DialogDescription className="text-gray-400 mt-4 text-sm md:text-base">
                      Explore the complete collection of developer tools, cloud services, and 
                      educational resources included in the GitHub Student Pack.
                    </DialogDescription>
                  </motion.div>
                </DialogHeader>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto min-h-0">
                  <div className="p-4 md:p-6">
                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                      {githubPackBenefits.map((benefit, index) => {
                        const IconComponent = benefit.icon;
                        
                        return (
                          <motion.div
                            key={benefit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group"
                          >
                            <Card className="h-full bg-gray-800/50 border border-gray-700/50 hover:border-gray-600 transition-all duration-200 overflow-hidden">
                              <CardContent className="p-4 h-full flex flex-col">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-lg ${benefit.bgColor} p-3 mb-3 flex items-center justify-center flex-shrink-0`}>
                                  <IconComponent className="w-6 h-6 text-white" />
                                </div>
                                
                                {/* Content */}
                                <div className="flex-1 flex flex-col">
                                  <h4 className="text-white mb-1 text-sm md:text-base">{benefit.name}</h4>
                                  <p className="text-blue-300 text-xs md:text-sm mb-2 font-medium">{benefit.offer}</p>
                                  
                                  <p className="text-gray-400 text-xs md:text-sm mb-4 leading-relaxed flex-1">
                                    {benefit.description}
                                  </p>
                                  
                                  {/* Footer */}
                                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-700/30">
                                    <div className="flex items-center text-blue-400 hover:text-blue-300 transition-colors cursor-pointer">
                                      <ExternalLink className="w-3 h-3 mr-1 flex-shrink-0" />
                                      <span className="text-xs">Learn more</span>
                                    </div>
                                    <span className="text-green-400 text-xs md:text-sm font-medium">{benefit.value}</span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Explore More Section */}
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="bg-gradient-to-r from-blue-600/20 to-green-600/20 rounded-2xl p-6 md:p-8 border border-blue-500/30"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full p-4 mx-auto mb-4 flex items-center justify-center">
                          <Package className="w-8 h-8 text-white" />
                        </div>
                        
                        <h3 className="text-xl md:text-2xl mb-3 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                          Discover 81+ More Amazing Perks!
                        </h3>
                        
                        <p className="text-gray-300 mb-6 leading-relaxed max-w-2xl mx-auto text-sm md:text-base">
                          The GitHub Student Pack includes over 90 incredible tools and services from industry-leading companies. 
                          From cloud hosting and design tools to productivity apps and development environments.
                        </p>
                        
                        <div className="flex flex-wrap justify-center gap-3 mb-6">
                          {['✨ Cloud Services', '🎨 Design Tools', '⚡ Developer Tools', '📚 Learning Resources'].map((category) => (
                            <div key={category} className="bg-gray-800/50 rounded-lg px-3 py-2 border border-gray-700/50">
                              <span className="text-blue-300 text-xs md:text-sm">{category}</span>
                            </div>
                          ))}
                        </div>
                        
                        <Button 
                          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-6 py-2 md:px-8 md:py-3 rounded-xl transition-all duration-200 hover:scale-105 text-sm md:text-base"
                          onClick={() => window.open('https://education.github.com/pack', '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Explore Full GitHub Student Pack
                        </Button>
                        
                        <p className="text-gray-400 text-xs md:text-sm mt-4">
                          🎓 Unlock with your .edu email address
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Fixed Footer */}
                <div className="p-4 md:p-6 border-t border-gray-700 flex justify-end flex-shrink-0">
                  <Button 
                    variant="outline"
                    onClick={() => setIsExpanded(false)}
                    className="text-gray-300 border-gray-600 hover:bg-white/5 text-sm md:text-base"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
}