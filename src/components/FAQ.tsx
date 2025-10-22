import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, CardContent } from './ui/card';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 1,
    question: "How do I verify my student status?",
    answer: "Simply sign up with your official student email address (ending in .edu or provided by your institution). Our system automatically verifies most educational email addresses. If additional verification is needed, you may be asked to upload a student ID or enrollment letter."
  },
  {
    id: 2,
    question: "What happens after I graduate?",
    answer: "Most benefits have different policies for post-graduation access. Some like GitHub Student Pack give you a grace period, while others like Spotify Premium Student require you to re-verify annually. We'll send you reminders before any benefits expire so you can transition to regular pricing if needed."
  },
  {
    id: 3,
    question: "Is EduBuzz free to use?",
    answer: "Yes, EduBuzz is completely free for students. We don't charge any fees for access to our platform or for helping you discover and apply for student benefits. The only costs you'll encounter are the discounted prices from the service providers themselves."
  },
  {
    id: 4,
    question: "How secure is my personal information?",
    answer: "We take security seriously and use enterprise-grade encryption to protect your data. We only share the minimum required information with benefit providers for verification purposes. We never sell your personal information, and you can delete your account and data at any time."
  },
  {
    id: 5,
    question: "Can I use benefits from multiple schools?",
    answer: "You can only use benefits associated with your current enrollment. If you're enrolled in multiple institutions simultaneously, you can verify with the email address from your primary institution. Transferring between schools typically requires re-verification with your new student email."
  },
  {
    id: 6,
    question: "What if a benefit application gets rejected?",
    answer: "If your application is rejected, we'll help you understand why and guide you through the appeal process. Common reasons include email verification issues or enrollment status problems. Our support team can assist with resubmissions and alternative verification methods."
  },
  {
    id: 7,
    question: "How often are new benefits added?",
    answer: "We continuously partner with new companies and regularly update our benefit offerings. New benefits are typically added weekly, and we notify users through email updates and dashboard announcements. You can also suggest companies you'd like to see added to our platform."
  },
  {
    id: 8,
    question: "Do benefits work internationally?",
    answer: "Many benefits are available globally, but some are region-specific. We clearly indicate geographic restrictions for each benefit. International students studying in supported countries can typically access most benefits using their local student email address."
  }
];

export function FAQ() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-6">
            <HelpCircle className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-4xl md:text-5xl text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Got questions? We've got answers. Find everything you need to know 
            about EduBuzz and student benefits.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-6 hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span className="text-lg text-gray-900 pr-4">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: openFAQ === faq.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    </motion.div>
                  </button>
                  
                  <AnimatePresence>
                    {openFAQ === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Support CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl mb-4">Still have questions?</h3>
            <p className="text-blue-100 mb-6">
              Our support team is here to help you make the most of your student benefits.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors duration-200">
              Contact Support
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}