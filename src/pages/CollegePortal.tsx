import { motion } from 'motion/react';
import { useEffect } from 'react';
import { HeroSection } from '../components/college-portal/HeroSection';
import { WorkflowSection } from '../components/college-portal/workflow/WorkflowSection';
import { RegistrationForm } from '../components/college-portal/RegistrationForm';
import { TestimonialCard } from '../components/college-portal/TestimonialCard';
import { FAQAccordion } from '../components/college-portal/FAQAccordion';
import { TESTIMONIALS } from '../types/collegePortal';
import { Card, CardContent } from '../components/ui/card';

/**
 * College Portal Registration Page
 * EduDomain Solutions - Institutional Email Service
 */
export default function CollegePortal() {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <HeroSection />

      {/* Workflow Section - How It Works */}
      <WorkflowSection />

      {/* Conversation Visual Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Understanding Institutional Email Adoption
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            See how colleges in Tamil Nadu are embracing .edu.in and .ac.in domains for enhanced credibility
          </p>
        </div>

        <Card className="border-0 shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <img
              src="/assets/Institutional Email Adoption in Tamil Nadu Colleges, 2025 - visual selection.png"
              alt="Institutional Email Adoption in Tamil Nadu Colleges - Conversation about registering .edu.in or .ac.in domains"
              className="w-full h-auto"
              loading="lazy"
            />
          </CardContent>
        </Card>
      </motion.section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Registration Section with Sidebar Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
          {/* Registration Form - Main Content (2/3 width on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2"
            id="registration-form"
          >
            <Card className="border-0 shadow-xl">
              <CardContent className="p-8 md:p-10">
                <div className="mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Register Your Institution
                  </h2>
                  <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
                    Fill out the form below and our team will contact you within 24 hours
                  </p>
                </div>

                <RegistrationForm />
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar - Testimonials (1/3 width on desktop) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-24 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Trusted by Leading Institutions
              </h3>

              <div className="space-y-4">
                {TESTIMONIALS.map((testimonial) => (
                  <TestimonialCard key={testimonial.id} testimonial={testimonial} />
                ))}
              </div>

              {/* Trust Badge */}
              <Card className="border-0 shadow-md bg-gradient-to-br from-blue-600 to-green-500 text-white">
                <CardContent className="p-6 text-center">
                  <div className="text-4xl font-bold mb-2">125+</div>
                  <div className="text-blue-100 text-sm mb-4">
                    Colleges using our service
                  </div>
                  <div className="h-px bg-white/30 mb-4"></div>
                  <div className="text-3xl font-bold mb-2">₹80Cr+</div>
                  <div className="text-blue-100 text-sm">
                    Total market value delivered
                  </div>
                </CardContent>
              </Card>

              {/* Support Contact */}
              <Card className="border-0 shadow-md">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                    Need Help?
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Our support team is here to assist you with any questions about the registration process.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Email:</span>{' '}
                      <a
                        href="mailto:support@studentperks.in"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        studentperkss@gmail.com
                      </a>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Phone:</span>{' '}
                      <a
                        href="tel:+918012345678"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        +91 7904734217
                      </a>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Available: Mon-Fri, 9 AM - 6 PM IST
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <FAQAccordion />
        </motion.div>

        {/* Final CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-20"
        >
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 via-blue-700 to-green-600 text-white overflow-hidden">
            <CardContent className="p-12 text-center relative">
              {/* Background Pattern */}
              <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:30px_30px]" />

              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Institution?
                </h2>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                  Join 125+ educational institutions that have already upgraded to professional
                  institutional email services.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="#registration-form" className="inline-block">
                    <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200 shadow-lg hover:shadow-xl">
                      Register Your College Now
                    </button>
                  </a>
                  <a href="mailto:support@studentperks.in" className="inline-block">
                    <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors duration-200">
                      Contact Sales Team
                    </button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
