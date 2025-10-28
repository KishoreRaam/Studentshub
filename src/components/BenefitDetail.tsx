import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { X, ExternalLink, Check, Star, Clock, Users, Shield } from 'lucide-react';

interface Benefit {
  id: number;
  title: string;
  description: string;
  image: string;
  value: string;
  badge: string;
  popular?: boolean;
  link?: string;
  fullDescription: string;
  features: string[];
  requirements: string[];
  howToApply: string[];
  validUntil?: string;
  usedBy?: string;
}

interface BenefitDetailProps {
  benefit: Benefit;
  onClose: () => void;
}

export function BenefitDetail({ benefit, onClose }: BenefitDetailProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        layoutId={`benefit-card-${benefit.id}`}
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0 shadow-2xl bg-white overflow-hidden">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 opacity-30 overflow-hidden">
            <ImageWithFallback
              src={benefit.image}
              alt={benefit.title}
              className="w-full h-full object-cover scale-110 blur-sm"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-green-500/20" />
          </div>

          {/* Content */}
          <div className="relative bg-white/95 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-start justify-between p-6 border-b border-gray-100">
              <div className="flex items-start space-x-4">
                <motion.div
                  layoutId={`benefit-image-${benefit.id}`}
                  className="w-20 h-20 rounded-xl overflow-hidden shadow-lg"
                >
                  <ImageWithFallback
                    src={benefit.image}
                    alt={benefit.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <motion.div layoutId={`benefit-badge-${benefit.id}`}>
                      <Badge variant="secondary">{benefit.badge}</Badge>
                    </motion.div>
                    {benefit.popular && (
                      <motion.div layoutId={`benefit-popular-${benefit.id}`}>
                        <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Popular</span>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  <motion.h1
                    layoutId={`benefit-title-${benefit.id}`}
                    className="text-2xl text-gray-900 mb-2"
                  >
                    {benefit.title}
                  </motion.h1>
                  
                  <motion.div
                    layoutId={`benefit-value-${benefit.id}`}
                    className="text-green-600 text-xl"
                  >
                    Save {benefit.value}
                  </motion.div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Scrollable Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="p-6 space-y-8">
                {/* Main Description */}
                <div>
                  <h2 className="text-xl text-gray-900 mb-4">About this benefit</h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {benefit.fullDescription}
                  </p>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 rounded-xl p-4 text-center border border-blue-100">
                    <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                    <div className="text-sm text-blue-600">Valid Until</div>
                    <div className="text-blue-900">{benefit.validUntil || 'Graduation'}</div>
                  </div>
                  
                  <div className="bg-green-50 rounded-xl p-4 text-center border border-green-100">
                    <Users className="w-6 h-6 text-green-600 mx-auto mb-2" />
                    <div className="text-sm text-green-600">Used by</div>
                    <div className="text-green-900">{benefit.usedBy || '10K+ Students'}</div>
                  </div>
                  
                  <div className="bg-purple-50 rounded-xl p-4 text-center border border-purple-100">
                    <Shield className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                    <div className="text-sm text-purple-600">Verification</div>
                    <div className="text-purple-900">Instant</div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-lg text-gray-900 mb-4">What's included</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {benefit.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start space-x-3"
                      >
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                <div>
                  <h3 className="text-lg text-gray-900 mb-4">Requirements</h3>
                  <div className="space-y-2">
                    {benefit.requirements.map((requirement, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700">{requirement}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* How to Apply */}
                <div>
                  <h3 className="text-lg text-gray-900 mb-4">How to get started</h3>
                  <div className="space-y-4">
                    {benefit.howToApply.map((step, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-gray-700 pt-1">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="p-6 border-t border-gray-100 bg-gray-50/50">
              <div className="flex space-x-4">
                {benefit.link ? (
                  <a
                    href={benefit.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 text-white"
                    >
                      <ExternalLink className="w-5 h-5 mr-2" />
                      Apply Now
                    </Button>
                  </a>
                ) : (
                  <Button
                    size="lg"
                    disabled
                    className="flex-1 bg-gray-400 text-white opacity-60"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Apply Now
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-gray-200 hover:bg-gray-50"
                >
                  Save for Later
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}