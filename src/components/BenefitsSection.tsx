import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Badge } from './ui/badge';
import { BenefitDetail } from './BenefitDetail';
import { GitHubStudentPack } from './GitHubStudentPack';
import { ExternalLink, Star } from 'lucide-react';

// Remove GitHub Student Pack from regular benefits array
const benefits = [
  {
    id: 2,
    title: "Canva Pro",
    description: "Premium design tools with unlimited downloads, premium templates, and brand kit features.",
    image: "https://images.unsplash.com/photo-1649091245823-18be815da4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW52YSUyMGRlc2lnbiUyMHRvb2x8ZW58MXx8fHwxNzU3NDMxMjg5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    value: "$120/year",
    badge: "Design",
    fullDescription: "Canva Pro unlocks premium design features for students, including access to millions of premium photos, graphics, and templates. Create stunning presentations, social media posts, and documents with professional design tools.",
    features: [
      "100GB cloud storage for your designs",
      "Access to 75M+ premium photos and graphics",
      "Unlimited folders to organize your work",
      "Brand Kit with custom colors and fonts",
      "Magic Resize for instant format changes",
      "Background remover tool",
      "Premium animations and effects",
      "Team collaboration features"
    ],
    requirements: [
      "Valid student email address",
      "Currently enrolled in educational institution",
      "Canva account (free to create)"
    ],
    howToApply: [
      "Sign up for a free Canva account",
      "Navigate to Canva for Education page",
      "Verify your student status with school email",
      "Get instant access to Pro features",
      "Start creating amazing designs"
    ],
    validUntil: "End of studies",
    usedBy: "15M+ Students"
  },
  {
    id: 3,
    title: "Microsoft 365",
    description: "Complete Office suite with Word, Excel, PowerPoint, OneDrive storage, and collaboration tools.",
    image: "https://images.unsplash.com/photo-1649433391420-542fcd3835ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaWNyb3NvZnQlMjBvZmZpY2V8ZW58MXx8fHwxNzU3NDAyNjUyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    value: "$100/year",
    badge: "Productivity",
    fullDescription: "Microsoft 365 Education provides students with the full Office suite including Word, Excel, PowerPoint, and more. Get 1TB of OneDrive storage and collaborate seamlessly with classmates and professors.",
    features: [
      "Microsoft Word, Excel, PowerPoint desktop apps",
      "1TB OneDrive cloud storage",
      "Microsoft Teams for collaboration",
      "Outlook email and calendar",
      "OneNote digital notebook",
      "Access apps on up to 5 devices",
      "Real-time co-authoring",
      "Advanced security features"
    ],
    requirements: [
      "Valid student email from eligible institution",
      "Currently enrolled student status",
      "Microsoft account (free to create)"
    ],
    howToApply: [
      "Visit Microsoft 365 Education page",
      "Enter your student email address",
      "Verify your eligibility",
      "Download Office apps or use online",
      "Sign in with your Microsoft account"
    ],
    validUntil: "Graduation",
    usedBy: "150M+ Students"
  },
  {
    id: 4,
    title: "Spotify Premium",
    description: "Ad-free music streaming with offline downloads and high-quality audio at student pricing.",
    image: "https://images.unsplash.com/photo-1658489958427-325ded050829?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG90aWZ5JTIwbXVzaWN8ZW58MXx8fHwxNzU3NDMxMjkwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    value: "$60/year",
    badge: "Entertainment",
    fullDescription: "Get Spotify Premium at 50% off the regular price with student discount. Enjoy ad-free music, offline downloads, and high-quality audio streaming with access to over 100 million songs and podcasts.",
    features: [
      "Ad-free music streaming",
      "Download music for offline listening",
      "High-quality audio (320kbps)",
      "Unlimited skips",
      "Play any song, anytime",
      "Access to exclusive content",
      "Spotify Connect across devices",
      "Podcast downloads"
    ],
    requirements: [
      "Currently enrolled at an accredited college or university",
      "Valid student email or documentation",
      "Available in supported countries",
      "Spotify account (free to create)"
    ],
    howToApply: [
      "Visit Spotify Premium Student page",
      "Click 'Get Premium Student'",
      "Verify student status through SheerID",
      "Complete payment setup ($4.99/month)",
      "Enjoy your premium music experience"
    ],
    validUntil: "Up to 4 years",
    usedBy: "8M+ Students"
  },
  {
    id: 5,
    title: "Adobe Creative Cloud",
    description: "Professional creative software including Photoshop, Illustrator, Premiere Pro, and more.",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZG9iZSUyMGNyZWF0aXZlfGVufDF8fHx8MTc1NzQzMTI5MHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    value: "$600/year",
    badge: "Creative",
    fullDescription: "Adobe Creative Cloud for Students provides access to the complete collection of Adobe's creative applications at a significant discount. Perfect for design, photography, video editing, and digital art projects.",
    features: [
      "20+ creative desktop and mobile apps",
      "Photoshop for photo editing and design",
      "Illustrator for vector graphics",
      "Premiere Pro for video editing",
      "After Effects for motion graphics",
      "InDesign for layout and publishing",
      "100GB cloud storage",
      "Adobe Fonts library access",
      "Behance portfolio integration"
    ],
    requirements: [
      "Enrolled in degree-granting institution",
      "Valid student ID or transcript",
      "Age 13 or older",
      "Adobe ID account"
    ],
    howToApply: [
      "Visit Adobe Creative Cloud Student page",
      "Choose your student plan",
      "Verify your student status",
      "Complete purchase with student pricing",
      "Download and install your creative apps"
    ],
    validUntil: "Duration of studies",
    usedBy: "5M+ Students"
  },
  {
    id: 6,
    title: "Figma Professional",
    description: "Advanced design and prototyping tools with unlimited projects and collaboration features.",
    image: "https://images.unsplash.com/photo-1653647054667-c99dc7f914ef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaWdtYSUyMGRlc2lnbnxlbnwxfHx8fDE3NTc0MzEyOTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    value: "$144/year",
    badge: "Design",
    fullDescription: "Figma Education provides free access to professional design and prototyping tools. Create stunning user interfaces, collaborate in real-time, and learn industry-standard design practices with unlimited projects and advanced features.",
    features: [
      "Unlimited Figma and FigJam files",
      "Unlimited version history",
      "Real-time collaboration",
      "Advanced prototyping features",
      "Design system libraries",
      "Developer handoff tools",
      "Team collaboration features",
      "Plugin ecosystem access"
    ],
    requirements: [
      "Valid educational email address",
      "Enrolled in accredited educational institution",
      "Figma account (free to create)",
      "Verification of academic status"
    ],
    howToApply: [
      "Create a free Figma account",
      "Apply for Figma for Education",
      "Verify your academic email address",
      "Get approved for education plan",
      "Start designing with full professional features"
    ],
    validUntil: "2 years after graduation",
    usedBy: "3M+ Students"
  }
];

export function BenefitsSection() {
  const [selectedBenefit, setSelectedBenefit] = useState<(typeof benefits)[0] | null>(null);

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900">
            Student Benefits
          </Badge>
          <h2 className="text-4xl md:text-5xl text-gray-900 dark:text-white mb-6">
            Exclusive Tools & Discounts
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Access premium software, services, and resources that would normally cost
            thousands of dollars. All you need is a valid student email address.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* GitHub Student Pack - Special Bundle Card */}
          <GitHubStudentPack />
          
          {/* Regular Benefits */}
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.id}
              layoutId={`benefit-card-${benefit.id}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (index + 1) * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group cursor-pointer"
              onClick={() => setSelectedBenefit(benefit)}
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden bg-white dark:bg-gray-800">
                <div className="relative">
                  {benefit.popular && (
                    <motion.div 
                      layoutId={`benefit-popular-${benefit.id}`}
                      className="absolute top-4 right-4 z-10"
                    >
                      <div className="bg-gradient-to-r from-blue-600 to-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-current" />
                        <span>Popular</span>
                      </div>
                    </motion.div>
                  )}
                  
                  <div className="aspect-[4/3] overflow-hidden">
                    <motion.div layoutId={`benefit-image-${benefit.id}`}>
                      <ImageWithFallback
                        src={benefit.image}
                        alt={benefit.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </motion.div>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <motion.div layoutId={`benefit-badge-${benefit.id}`}>
                      <Badge variant="secondary" className="text-xs">
                        {benefit.badge}
                      </Badge>
                    </motion.div>
                    <motion.span 
                      layoutId={`benefit-value-${benefit.id}`}
                      className="text-green-600 font-semibold text-sm"
                    >
                      {benefit.value}
                    </motion.span>
                  </div>
                  
                  <motion.h3 
                    layoutId={`benefit-title-${benefit.id}`}
                    className="text-xl text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                  >
                    {benefit.title}
                  </motion.h3>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                    {benefit.description}
                  </p>
                  
                  <div className="flex items-center text-blue-600 group-hover:text-blue-700 transition-colors duration-200">
                    <span className="text-sm mr-2">Learn more</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View More Benefits Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/perks">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden bg-gradient-to-r from-blue-600 to-green-500 rounded-xl text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 btn-float">
              <span className="relative z-10 flex items-center space-x-2">
                <span className="font-medium">View More Benefits</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </Link>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-green-500 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl mb-4">
              Ready to unlock these benefits?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Verify your student email and start saving thousands on the tools you need for your education and career.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-200">
              Get Started Now
            </button>
          </div>
        </motion.div>

        {/* Benefit Detail Modal */}
        <AnimatePresence>
          {selectedBenefit && (
            <BenefitDetail
              benefit={selectedBenefit}
              onClose={() => setSelectedBenefit(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}